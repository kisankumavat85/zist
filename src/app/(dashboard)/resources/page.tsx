import ResourcePicker from "@/components/resource-picker";
import ResourceUploader from "@/components/resource-uploader";
import { getResources } from "@/db/data/resources";

const ResourcesPage = async () => {
  const resources = await getResources({});

  return (
    <div className="flex flex-col gap-8 text-purple-500-500">
      <ResourceUploader />
      <ResourcePicker resources={resources} />
    </div>
  );
};

export default ResourcesPage;
