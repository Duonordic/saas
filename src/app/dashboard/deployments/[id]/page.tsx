// // app/dashboard/deployments/[id]/page.tsx
// import { deploymentService } from "@/lib/services/deployment-service";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// import {
//   ArrowLeft,
//   ExternalLink,
//   RefreshCw,
//   Settings,
//   Trash2,
// } from "lucide-react";
// import Link from "next/link";
// import { EnvVarsManager } from "@/components/dashboard/env-vars-manager";
// import { LogsViewer } from "@/components/dashboard/logs-viewer";
// import { templateService } from "@/lib/services/template-service";
// import { notFound } from "next/navigation";

// interface DeploymentDetailPageProps {
//   params: { id: string };
// }

// export default async function DeploymentDetailPage({
//   params,
// }: DeploymentDetailPageProps) {
//   const deployment = await deploymentService.getDeployment(params.id);

//   if (!deployment?.template_id) {
//     return notFound();
//   }

//   const template = await templateService.getTemplate(deployment.template_id);

//   if (!deployment) {
//     return <div>Deployment not found</div>;
//   }

//   const getStatusVariant = (status: string) => {
//     switch (status) {
//       case "running":
//         return "default";
//       case "failed":
//         return "destructive";
//       case "building":
//         return "secondary";
//       default:
//         return "outline";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <Button variant="ghost" size="sm" asChild>
//             <Link href="/dashboard/deployments">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back
//             </Link>
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               {deployment.name}
//             </h1>
//             <p className="text-muted-foreground">
//               Deployed from {template?.name || "Uknown Template"}
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Badge variant={getStatusVariant(deployment.status)}>
//             {deployment.status}
//           </Badge>
//           {deployment.deployment_url && (
//             <Button variant="outline" size="sm" asChild>
//               <a
//                 href={deployment.deployment_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <ExternalLink className="h-4 w-4 mr-2" />
//                 Visit
//               </a>
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Action Bar */}
//       <div className="flex items-center space-x-2">
//         <Button variant="outline">
//           <RefreshCw className="h-4 w-4 mr-2" />
//           Redeploy
//         </Button>
//         <Button variant="outline">
//           <Settings className="h-4 w-4 mr-2" />
//           Settings
//         </Button>
//         <Button variant="destructive">
//           <Trash2 className="h-4 w-4 mr-2" />
//           Delete
//         </Button>
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid gap-6 lg:grid-cols-2">
//         {/* Left Column */}
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Deployment Information</CardTitle>
//               <CardDescription>Details about this deployment</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm font-medium">Status</p>
//                   <p className="text-sm text-muted-foreground capitalize">
//                     {deployment.status.replace("_", " ")}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium">Template</p>
//                   <p className="text-sm text-muted-foreground">
//                     {template?.name || "Uknown Template"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium">Subdomain</p>
//                   <p className="text-sm text-muted-foreground">
//                     {deployment.subdomain}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium">Created</p>
//                   <p className="text-sm text-muted-foreground">
//                     {new Date(deployment.created_at).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//               {deployment.custom_domain && (
//                 <div>
//                   <p className="text-sm font-medium">Custom Domain</p>
//                   <p className="text-sm text-muted-foreground">
//                     {deployment.custom_domain}
//                   </p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           <EnvVarsManager
//             initialVars={deployment.env_vars as Record<string, string>}
//             deploymentId={deployment.id}
//           />
//         </div>

//         {/* Right Column */}
//         <div className="space-y-6">
//           <LogsViewer deploymentId={deployment.id} />

//           <Card>
//             <CardHeader>
//               <CardTitle>Build Configuration</CardTitle>
//               <CardDescription>Framework and build settings</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {deployment.build_config &&
//               Object.keys(deployment.build_config as object).length > 0 ? (
//                 <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
//                   {JSON.stringify(deployment.build_config, null, 2)}
//                 </pre>
//               ) : (
//                 <p className="text-sm text-muted-foreground">
//                   Using default build configuration
//                 </p>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
