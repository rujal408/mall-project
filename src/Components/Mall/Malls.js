import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'
import Card from '../Card'
import { shuffle } from '../../utils/Shuffle'

function Malls({ malls, deleteMallData }) {
    const history = useHistory()

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
                                handleClick={() => history.push('/' + mall.id)}
                                url={mall.mall_image.url}
                                crossClick={() => deleteMallData(mall)}

                            />
                        </Grid>
                    ))
                }


            </Grid>
            {malls.length > 2 && <Link to="/malls" className="link">View All</Link>}
        </Grid>
    )
}

export default Malls
