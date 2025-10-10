interface PageProps {
  searchParams: Promise<{ keyword: string }>;
}

async function page({ searchParams }: PageProps) {
  const { keyword } = await searchParams;

  return <div> {keyword} : 검색페이지</div>;
}

export default page;
