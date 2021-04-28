import { Button } from '@material-ui/core';
import React from 'react'

export const paginate = (array = [], page_size, page_number) => {
    const indexOfLastPost = page_size * page_number
    const indexOfFirstPost = indexOfLastPost - page_size
    return array.slice(indexOfFirstPost, indexOfLastPost)
};

export const Pagination = ({ postPerPage, totalPosts, paginate, setPostPerPage }) => {
    const pageNumber = []
    for (let i = 0; i < Math.ceil(totalPosts / postPerPage); i++) {
        pageNumber.push(i)
    }

    if (totalPosts > 3) {
        return (
            <div>
                {
                    pageNumber.map(page => (
                        <Button
                            key={page}
                            onClick={() => paginate(page + 1)}
                            color="primary"
                            variant="contained"
                            style={{ margin: 5 }}
                        >
                            {page + 1}
                        </Button>
                    ))
                }
                <select defaultValue="" onChange={setPostPerPage}>
                    <option disabled value="">Post Per Page</option>
                    <option value="3">3</option>
                    <option value="6">6</option>
                </select>
            </div>
        )
        
    }else{
        return null
    }

}