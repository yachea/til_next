interface PageProps {
  params: Promise<{ id: string }>;
}

async function page({ params }: PageProps) {
  const { id } = await params;
  return <div>{id}번 상품</div>;
}

export default page;
