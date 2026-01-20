import { getResourceById, getResources } from "@/actions/resources";
import Chat from "./chat";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ChatPage = async (props: Props) => {
  const { searchParams } = props;
  const { r: resourceId } = await searchParams;
  const resources = await getResources({ limit: 5 });
  let selectedResource;
  if (resourceId) {
    const resource = await getResourceById(Number(resourceId));
    selectedResource = resource;
  }

  return (
    <div className="h-full flex justify-center items-center">
      <Chat initialResources={resources} selectedResource={selectedResource} />
    </div>
  );
};

export default ChatPage;
