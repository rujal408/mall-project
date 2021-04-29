import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'
import Card from '../Card'
import { shuffle } from '../../utils/Shuffle'

function Malls({ malls, deleteMallData,adminMode}) {
    const history = useHistory()

    const locationChange = (id) => {
        if (!adminMode) {
            history.push('/' + id + '/user')
        } else {
            history.push('/' + id)
        }
    }
    return (
        <Grid>
            <Typography variant="h4" color="secondary">Malls</Typography>

            <Grid container spacing={2}>
                {
                    shuffle(malls).slice(0, 3).map(mall => (
                        <Grid item sm={4} xs={6} key={mall.id}>
                            <Card
                                name={mall.mall_name}
                                description={mall.mall_address}
                                handleClick={() => locationChange(mall.id)}
                                url={mall.mall_image.url}
                                crossClick={() => deleteMallData(mall)}
                                adminMode={adminMode}
                            />
                        </Grid>
                    ))
                }


            </Grid>
            {malls.length > 2 && <Link to={!adminMode ? "/malls/user" : "/malls"} className="link">View All</Link>}
        </Grid>
    )
}

export default Malls
