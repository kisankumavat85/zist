import ResourcePicker from "@/components/resource-picker";
import ResourceUploader from "@/components/resource-uploader";
import { selectResource } from "@/db/query/resources";

const ResourcesPage = async () => {
  const resources = await selectResource();
  console.log("resources", resources);
  return (
    <div className="flex flex-col gap-8 text-purple-500-500">
      <ResourceUploader />
      <ResourcePicker resources={resources} />
    </div>
  );
};

export default ResourcesPage;
