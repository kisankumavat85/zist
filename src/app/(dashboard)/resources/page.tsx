import { getResources } from "@/actions/resources";
import ResourcePicker from "@/components/resource-picker";
import ResourceUploader from "@/components/resource-uploader";

const ResourcesPage = async () => {
  const resources = await getResources({});

  return (
    <div className="flex justify-center overflow-y-auto h-full">
      <div className="flex flex-col gap-8 w-180">
        <ResourceUploader />
        <ResourcePicker resources={resources} />
      </div>
    </div>
  );
};

export default ResourcesPage;
