import { Button, Grid, TextField } from '@material-ui/core'
import React from 'react'
import { useHistory, useLocation } from 'react-router'
import Malls from '../Components/Mall/Malls'
import Shops from '../Components/Shop/Shops'
import { shuffle } from '../utils/Shuffle'
import HOC from '../Components/HOC'
import Nav from '../Components/Nav'

function Dashboard({ malls, updateMallData, deleteMallData }) {

    const history = useHistory()
    const location = useLocation()
    const [mallData, setMall] = React.useState([])

    React.useEffect(() => {
        if (malls) {
            setMall(malls)
        }
    }, [malls])

    const shops = mallData.map(x => ({ id: x.id, mall_name: x.mall_name, shop: shuffle(x.shops) }))

    const searchMall = (e) => {
        const text = e.target.value
        const data = malls.filter(mall => {
            if (text.length > 0) {
                return mall.mall_name.toLowerCase().includes(text.toLowerCase())
            } else {
                return mall
            }
        })
        setMall(data)
    }

    const adminMode = location.pathname.includes('dashboard')

    return (
        <>
            {adminMode && <Nav />}
            <Grid container spacing={2}
                style={{ width: "90%", margin: "auto" }}
            >
                {!adminMode && <Grid item sm={12} style={{ textAlign: 'center' }}>
                    <TextField
                        name="search"
                        label="Search Mall..."
                        variant="filled"
                        style={{ width: "40%" }}
                        onChange={searchMall}
                    />
                </Grid>}
                {adminMode && <Grid item sm={12}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => history.push('/addMall')}
                    >
                        Add Mall
                </Button>
                </Grid>}
                {
                    malls.length > 0 ?
                        <>
                            <Grid item sm={12}>
                                <Malls malls={mallData} deleteMallData={deleteMallData} adminMode={adminMode} />
                            </Grid>
                            <Grid item sm={12}>
                                <Shops shops={shops} malls={mallData} updateMallData={updateMallData} adminMode={adminMode} />
                            </Grid>
                        </>
                        :
                        <h1>No Data Available</h1>
                }

            </Grid >
        </>
    )
}



export default HOC(Dashboard)