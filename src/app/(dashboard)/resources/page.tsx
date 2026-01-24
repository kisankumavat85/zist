import { getResources } from "@/actions/resources";
import ResourcePicker from "@/components/resource-picker";
import ResourceUploader from "@/components/resource-uploader";

const ResourcesPage = async () => {
  const resources = await getResources({});

  return (
    <div className="flex justify-center overflow-auto h-full px-4 lg:px-0">
      <div className="flex flex-col gap-8 max-w-180 w-full py-6">
        <ResourceUploader />
        <ResourcePicker resources={resources} />
      </div>
    </div>
  );
};

export default ResourcesPage;
