"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { SanityClient } from "@sanity/client";
import { createTenantClient } from "@/lib/sanity/client";

// Types for our hooks
interface SanityQueryResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

// Create a properly typed context
const SanityClientContext = createContext<SanityClient | null>(null);

// Provider component for tenant-specific Sanity operations
interface SanityProviderProps {
  children: ReactNode;
  tenant: any;
}

export function SanityProvider({ children, tenant }: SanityProviderProps) {
  const [client, setClient] = useState<SanityClient | null>(null);

  useEffect(() => {
    const sanityClient = createTenantClient(tenant);
    setClient(sanityClient);
  }, [tenant]);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">
          Initializing Sanity client...
        </div>
      </div>
    );
  }

  return (
    <SanityClientContext.Provider value={client}>
      {children}
    </SanityClientContext.Provider>
  );
}

// Hook for using the tenant-specific Sanity client
export function useSanityClient(): SanityClient {
  const client = useContext(SanityClientContext);
  if (!client) {
    throw new Error("useSanityClient must be used within a SanityProvider");
  }
  return client;
}

// Simple hook for fetching page data
export function usePageData(pageType: string): SanityQueryResult<any> {
  const { tenant } = useDashboard();
  const client = useSanityClient();
  const [state, setState] = useState<SanityQueryResult<any>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const query = `*[_type == "page" && pageType == $pageType][0]{
          _id,
          _type,
          title,
          slug,
          seoTitle,
          seoDescription,
          seoKeywords,
          seoNoIndex,
          pageBuilder[]{
            _type,
            _key,
            ...,
            _type == "hero" => {
              heading,
              subheading,
              ctaButton,
              image
            }
          }
        }`;

        const data = await client.fetch(query, { pageType });

        if (mounted) {
          setState({
            data,
            error: null,
            loading: false,
          });
        }
      } catch (error) {
        if (mounted) {
          setState({
            data: null,
            error: error as Error,
            loading: false,
          });
        }
      } finally {
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [client, pageType, tenant.id]);

  return state;
}

// Hook for site settings
export function useSiteSettings(): SanityQueryResult<any> {
  const { tenant } = useDashboard();
  const client = useSanityClient();
  const [state, setState] = useState<SanityQueryResult<any>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const query = `*[_type == "siteSettings"][0]{
          _id,
          _type,
          siteTitle,
          siteDescription,
          siteKeywords,
          favicon,
          logo,
          socialLinks,
        }`;

        const data = await client.fetch(query);

        if (mounted) {
          setState({
            data,
            error: null,
            loading: false,
          });
        }
      } catch (error) {
        if (mounted) {
          setState({
            data: null,
            error: error as Error,
            loading: false,
          });
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [client, tenant.id]);

  return state;
}

// Mutation hook for updating content
export function useUpdateContent() {
  const client = useSanityClient();
  const [loading, setloading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (documentId: string, data: any) => {
    setloading(true);
    setError(null);

    try {
      const result = await client.patch(documentId).set(data).commit();

      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setloading(false);
    }
  };

  return {
    mutate,
    loading,
    error,
  };
}

// Hook for real-time content updates
export function useLiveQuery(query: string, params: Record<string, any> = {}) {
  const client = useSanityClient();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;

    async function setupSubscription() {
      try {
        setLoading(true);

        // Initial fetch
        const initialData = await client.fetch(query, params);
        if (mounted) {
          setData(initialData);
          setLoading(false);
        }

        // Set up real-time subscription
        subscription = client
          .listen(query, params, {
            events: ["welcome", "mutation", "reconnect"],
          })
          .subscribe({
            next: (event: any) => {
              if (mounted && event.type === "mutation") {
                // Refetch the data on mutation with proper typing
                client.fetch(query, params).then((newData: any) => {
                  if (mounted) {
                    setData(newData);
                  }
                });
              }
            },
            error: (err: Error) => {
              if (mounted) {
                setError(err);
                setLoading(false);
              }
            },
          });
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    }

    setupSubscription();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [client, query, JSON.stringify(params)]);

  return { data, error, loading };
}

// Simplified version for basic queries
export function useSanityFetch<T = any>(
  query: string,
  params: Record<string, any> = {},
): SanityQueryResult<T> {
  const client = useSanityClient();
  const [state, setState] = useState<SanityQueryResult<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const data: T = await client.fetch(query, params);

        if (mounted) {
          setState({
            data,
            error: null,
            loading: false,
          });
        }
      } catch (error) {
        if (mounted) {
          setState({
            data: null,
            error: error as Error,
            loading: false,
          });
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [client, query, JSON.stringify(params)]);

  return state;
}
