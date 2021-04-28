import { Button, Card, CardContent, Grid, TextField, Typography, LinearProgress } from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router'
import { login } from '../redux/actions/user'
import { LOGIN_SUCCESS } from '../redux/actionType'


function Login(props) {

    const history = useHistory()
    const submitData = async (e) => {
        e.preventDefault()
        const target = e.target
        const username = target.username.value
        const password = target.password.value
        let validation = await props.login({ username, password })
        if (validation) {
            localStorage.setItem("user_token", "fjsldfjslfd09sdf80sdf")
            props.setToken("fjsldfjslfd09sdf80sdf")
            history.push('/dashboard')
        }

    }

    return (
        <Grid container spacing={2}>
            <Grid item sm={12}>
                {props.loading && <LinearProgress />}
                <Card className="login-form">
                    <Typography variant="h6" component="h6" align="center" style={{ background: "#95a5a6" }}>
                        Login
                    </Typography>
                    <CardContent style={{ background: "#95a5a6" }}>
                        <form className="login-fields" onSubmit={submitData}>
                            <div className="form-control">
                                <TextField
                                    name="username"
                                    label="Enter Username"
                                    inputProps={{ valid: ["required", /^\w*$/] }}
                                />
                            </div>
                            <div className="form-control">
                                <TextField
                                    name="password"
                                    type="password"
                                    label="Enter Password"
                                    fullWidth
                                    inputProps={{ valid: ["required", /^\w*$/] }}
                                />
                            </div>
                            <div className="form-control">
                                <Button variant="contained" color="primary" type="submit">
                                    {props.loading ? "Processing" : "Submit"}
                                </Button>
                            </div>
                        </form>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = state => {
    return {
        loading: state.userReducer.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: data => dispatch(login(data)),
        setToken:(payload)=>dispatch({type:LOGIN_SUCCESS, payload})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
