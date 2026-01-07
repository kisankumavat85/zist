type Props = { params: Promise<{ id: string }> };

const ActiveChatPage = async (props: Props) => {
  const { params } = props;
  const { id } = await params;

  return <div>Id: {id}</div>;
};

export default ActiveChatPage;
