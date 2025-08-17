import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css"
interface PaginationProps{
  pageCount:number;
  onPageChange:(selectedPage: number)=>void;  
}


export default function Pagination({pageCount, onPageChange}:PaginationProps){
    return(
       <ReactPaginate
            pageCount={pageCount}
            containerClassName={css.pagination}
            activeClassName={css.active}
            breakLabel="..."
            nextLabel="→"
            previousLabel="←"
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            onPageChange={(event)=>{
            onPageChange(event.selected+1)
            }} 
/> 
    );
}
