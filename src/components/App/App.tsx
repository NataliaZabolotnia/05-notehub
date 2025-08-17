import { useState } from 'react'
import css from "./App.module.css"
import "modern-normalize/modern-normalize.css"
import SearchBox from "../SearchBox/SearchBox"
import { fetchNotes ,postNote ,deleteNote} from '../../services/noteService'
import NoteList from '../NoteList/NoteList'
import { keepPreviousData, useQuery,useMutation,useQueryClient } from '@tanstack/react-query'
import Pagination from '../Pagination/Pagination'
import NoteForm from "../NoteForm/NoteForm"
import Modal from '../Modal/Modal'
import type { NewNote } from '../../types/note'
import { useDebouncedCallback } from 'use-debounce'
import StatusWrapper from '../Status/StatusWrapper'


export default function App () {
const [searchText,setSearchText]=useState("");
const[currentPage,setCurrentPage]=useState(1);
const[isModalOpen,setIsModalOpen]=useState(false);
const [inputValue, setInputValue] = useState("");
const openModal=()=>setIsModalOpen(true);
const closeModal=()=>setIsModalOpen(false);
const queryClient=useQueryClient();

const {data, isLoading, error }=useQuery({
  queryKey:["notes",currentPage,searchText],
  queryFn:()=>fetchNotes(currentPage,searchText) ,
  placeholderData:keepPreviousData,
});

const updateSearchQuery = useDebouncedCallback(
  (value: string) => setSearchText(value),
  300
);

const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  setInputValue(value);         
  updateSearchQuery(value);     
};

const handlePageChange=(newPage:number)=>{
  setCurrentPage(newPage);
}

const mutation=useMutation({
  mutationFn: postNote,
  onSuccess:()=>{
    queryClient.invalidateQueries(
      {queryKey:["notes"]}
    );
    closeModal();
    }
  },
  )
 const deleteMutation=useMutation({
   mutationFn:deleteNote,
    onSuccess:()=>{
    queryClient.invalidateQueries(
      {queryKey:["notes"]}
    );
    }
})

return(
<div className={css.app}>
<header className={css.toolbar}>
		<SearchBox value={inputValue}  
    onChange={handleSearchChange}/>
    {data && !isLoading && ( <Pagination
      pageCount={data.totalPages}
      onPageChange={handlePageChange}/>)}
      <button className={css.button} onClick={openModal}>Create note +</button>
</header>

<StatusWrapper
  isLoading={isLoading}
  isError={!!error}
  isEmpty={!isLoading && data?.notes.length === 0}
  error={error}
>
  <NoteList
    notes={data?.notes ?? []}
    onDelete={(id) => deleteMutation.mutate(id)}
  />
</StatusWrapper>

{isModalOpen && (
<Modal onClose={closeModal}>
<NoteForm   onSubmit={(values:NewNote)=>mutation.mutate(values)}
  onCancel={closeModal}/>
</Modal>
)}
</div>  
);
}