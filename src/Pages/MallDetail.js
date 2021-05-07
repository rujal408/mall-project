import React from 'react'
import { Typography, Grid, Button } from '@material-ui/core'
import { useHistory } from 'react-router'
import { paginate, Pagination } from '../utils/Paginate'
import Card from '../Components/Card'
import HOC from '../Components/HOC'
import { deleteShop } from '../utils/deleteShop'


function MallDetail({ malls, updateMallData, match }) {
    const { id } = match.params
    const history = useHistory()
    const [detail, setDetail] = React.useState({ id: '', mall_name: '', mall_address: '', shops: [] })
    const [currentPage, setPage] = React.useState(1)
    const [postPerPage, setPostPerPage] = React.useState(3)

    React.useEffect(() => {
        if (id) {
            const mallDetail = malls.find(mall => mall.id === id)
            mallDetail && setDetail(mallDetail)
        }
    }, [id, malls])

    const runPaginate = (number) => setPage(number)

    const handleShopDelete = async (shop_id) => {
        const data = await deleteShop(malls, id, shop_id)
        if (data) {
            updateMallData(id, data)
        }
    }

    const adminMode = !match.path.includes("user")

    const locationChange = (shopId) => {
        if (!adminMode) {
            history.push(`/${id}/shop/${shopId}/user`)
        } else {
            history.push(`/${id}/shop/${shopId}`)
        }
    }

    return (
        <Grid>
            <Grid container spacing={2}>
                <Grid item sm={12} xs={12}>
                    <Typography variant="h4" component="h4" color="primary" style={{ textAlign: "center" }}>
                        {detail.mall_name}
                    </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                    <Typography variant="h5" component="h5" color="primary" style={{ textAlign: "center" }}>
                        {detail.mall_address}
                    </Typography>
                </Grid>

                <Grid container spacing={2} style={{ margin: "auto", width: "90%" }}>
                    {adminMode && <>
                        <Grid item sm={3}>
                            <Button
                                onClick={() => history.push('/' + detail.id + '/addShop')}
                                variant="contained"
                                color="secondary">Add Shop</Button>
                        </Grid>
                        <Grid item sm={3}>
                            <Button
                                onClick={() => history.push('/' + detail.id + '/editMall')}
                                variant="contained"
                                color="secondary">Edit Mall</Button>
                        </Grid>
                    </>}
                    <Grid item sm={12}>
                        <Grid container spacing={2}>
                            <Grid item sm={12}>
                                <Typography variant="h4" color="primary">Shops</Typography>
                            </Grid>
                            {
                                paginate(detail.shops, postPerPage, currentPage)
                                    .map(shop => (
                                        <Grid item sm={4} xs={12} key={shop.shop_id}>
                                            <Card
                                                name={shop.shop_name}
                                                description={detail.mall_name}
                                                url={shop.images[0].url}
                                                handleClick={() => locationChange(shop.shop_id)}
                                                crossClick={() => handleShopDelete(shop.shop_id)}
                                                adminMode={adminMode}
                                            />
                                        </Grid>
                                    ))
                            }
                        </Grid>
                        <Grid container spacing={2} >
                            <Grid item sm={12}>
                                <Pagination
                                    postPerPage={postPerPage}
                                    totalPosts={detail.shops.length}
                                    paginate={runPaginate}
                                    setPostPerPage={setPostPerPage}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default HOC(MallDetail)
