import { getResources } from "@/actions/resources";
import ResourcePicker from "@/components/resource-picker";
import ResourceUploader from "@/components/resource-uploader";
import { auth } from "@clerk/nextjs/server";

const ResourcesPage = async () => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  const resources = await getResources({ userId });

  return (
    <div className="flex flex-col gap-8 text-purple-500-500">
      <ResourceUploader />
      <ResourcePicker resources={resources} />
    </div>
  );
};

export default ResourcesPage;
