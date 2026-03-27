

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

type NotesPageProps = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const search = params.search || "";


  const queryClient = new QueryClient();

 
  await queryClient.prefetchQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, search }),
  });

 
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
    <NotesClient
      initialPage={page}
      initialSearch={search}
      dehydratedState={dehydratedState}
    />
    </HydrationBoundary>
  );
}
