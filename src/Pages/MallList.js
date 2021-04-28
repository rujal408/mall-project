import { Grid, TextField, Typography, Button } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router'
import { paginate, Pagination } from '../utils/Paginate'
import Card from '../Components/Card'
import HOC from '../Components/HOC'

const userToken = localStorage.getItem("user_token")


function MallList({ malls, deleteMallData }) {
    
    const history = useHistory()
    const [search, setSearch] = React.useState('')
    const [currentPage, setPage] = React.useState(1)
    const [postPerPage, setPostPerPage] = React.useState(6)

    const handleChange = (e) => {
        setPage(1)
        const value = e.target.value
        setSearch(value)
    }

    const runPaginate = (number) => setPage(number)

    const filteredMalls = malls.filter(x => search === "" ? x
        :
        x.mall_name.toLowerCase().includes(search.toLowerCase()))

    return (

        <Grid container spacing={2} style={{ width: "90%", margin: "auto" }}>
            <Grid item sm={12} md={12} style={{ textAlign: 'center' }}>
                <TextField
                    name="search"
                    label="Search"
                    variant="filled"
                    onChange={handleChange}
                    style={{ width: "35%" }}
                />
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={12}>
                    {userToken && <Grid item sm={12}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => history.push('/addMall')}
                        >
                            Add Mall
                        </Button>

                    </Grid>}
                    <Typography variant="h4" color="secondary">Malls</Typography>
                </Grid>

                {
                    paginate(filteredMalls, postPerPage, currentPage)
                        .map(mall => (
                            <Grid item sm={4} xs={12} key={mall.id}>
                                <Card
                                    name={mall.mall_name}
                                    description={mall.mall_address}
                                    handleClick={() => history.push('/' + mall.id)}
                                    url={mall.mall_image.url}
                                    crossClick={() => deleteMallData(mall)}
                                />

                            </Grid>
                        ))
                }
            </Grid>
            <Grid container spacing={2}>
                <Grid item sm={12}>
                    <Pagination
                        postPerPage={postPerPage}
                        totalPosts={malls.length}
                        paginate={runPaginate}
                        setPostPerPage={(e) => { setPostPerPage(+e.target.value); setPage(1) }}
                    />
                </Grid>
            </Grid>
        </Grid>


    )
}


export default HOC(MallList)
