import { Studio } from "sanity";

import studioConfig from "../sanity.config";

interface StudioComponentProps {
  basePath: string;
}

export default function StudioComponent({ basePath }: StudioComponentProps) {
  return <Studio basePath={basePath} config={studioConfig} />;
}
