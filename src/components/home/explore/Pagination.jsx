import { useState } from "react";
import { useAppState } from "../../../context";
import { fetchRooms } from "../../../context/reducer";

export const Pagination = ({ totalPages }) => {
  const { dispatch } = useAppState();
  const [currentPage, setCurrentPage] = useState(1);
  function getNextPage() {
    fetchRooms(currentPage + 1, 6).then((result) => {
      dispatch({ type: "fetchRooms", payload: { paginatedRooms: result.rooms, total: result.total } });
    });
    setCurrentPage((prev) => prev + 1);
  }
  function getPrevPage() {
    fetchRooms(currentPage - 1, 6).then((result) => {
      dispatch({ type: "fetchRooms", payload: { paginatedRooms: result.rooms, total: result.total } });
    });
    setCurrentPage((prev) => prev - 1);
  }
  return (
    <div className='pagination flex justify-center items-center p-1 mt-2 rounded-xl bg-violet-700/25 lg:justify-center bottom-0 w-full'>
      <div id='pagination' className='flex items-center gap-x-3'>
        <div id='pagination-total'>
          <span id='current'>{currentPage} </span>
          of
          <span id='total'> {Math.ceil(totalPages / 6)} </span>
        </div>
        <div id='arrows' className='text-4xl flex'>
          {currentPage > 1 && (
            <>
              <div id='super_back'>
                <i className={"bx bx-chevrons-left cursor-pointer rounded-full hover:bg-indigo-300 "}></i>
              </div>
              <div id='back' onClick={getPrevPage}>
                <i className={"bx bx-chevron-left cursor-pointer rounded-full ml-3 hover:bg-indigo-300 "}></i>
              </div>
            </>
          )}
          {currentPage !== Math.ceil(totalPages / 6) && (
            <>
              <div id='front' onClick={getNextPage} className={"" + (currentPage >= totalPages && "text-white/20")}>
                <i className='bx bx-chevron-right cursor-pointer rounded-full ml-3 hover:bg-indigo-300'></i>
              </div>
              <div id='super_front' className={"" + (currentPage >= totalPages && "text-white/20")}>
                <i className='bx bx-chevrons-right cursor-pointer rounded-full ml-3 hover:bg-indigo-300'></i>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
