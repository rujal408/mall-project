import { Button, Grid, TextField } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router'
import Malls from '../Components/Mall/Malls'
import Shops from '../Components/Shop/Shops'
import { shuffle } from '../utils/Shuffle'
import HOC from '../Components/HOC'



function Dashboard({ malls, updateMallData, deleteMallData, user_token }) {

    console.log(user_token);

    const history = useHistory()
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

    return (
        <Grid container spacing={2}
            style={{ width: "90%", margin: "auto" }}
        >
            {!user_token && <Grid item sm={12} style={{ textAlign: 'center' }}>
                <TextField
                    name="search"
                    label="Search Mall..."
                    variant="filled"
                    style={{ width: "40%" }}
                    onChange={searchMall}
                />
            </Grid>}
            {user_token && <Grid item sm={12}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => history.push('/addMall')}
                >
                    Add Mall
                </Button>
            </Grid>}
            <Grid item sm={12}>
                <Malls malls={mallData} deleteMallData={deleteMallData} />
            </Grid>
            <Grid item sm={12}>
                <Shops shops={shops} malls={mallData} updateMallData={updateMallData} />
            </Grid>
        </Grid >
    )
}



export default HOC(Dashboard)