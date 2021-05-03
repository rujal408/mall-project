import { Button, Card, CardContent, Grid, TextField, Typography, LinearProgress } from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router'
import { login } from '../redux/actions/user'
import { LOGIN_SUCCESS } from '../redux/actionType'
import { useForm, Controller } from 'react-hook-form'

function Login(props) {

    const { control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            username: '',
            password: ''
        }
    })
    const history = useHistory()

    const submitData = async (data) => {

        const { username, password } = data

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
                        <form className="login-fields" onSubmit={handleSubmit(submitData)}>
                            <div className="form-control">
                                <Controller
                                    control={control}
                                    name="username"
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Please Enter User Name"
                                        },
                                    }}
                                    defaultValue=""
                                    render={({
                                        field: { value, name, ref, onChange },
                                    }) => (
                                        <TextField
                                            onChange={onChange}
                                            label="Enter Username"
                                            inputRef={ref}
                                            name={name}
                                            value={value}
                                            error={errors?.username && true}
                                            helperText={errors?.username?.message}
                                        />
                                    )}
                                />
                            </div>
                            <div className="form-control">
                                <Controller
                                    control={control}
                                    name="password"
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Please Enter Password"
                                        },
                                    }}
                                    defaultValue=""
                                    render={({
                                        field: { value, name, ref, onChange },
                                    }) => (
                                        <TextField
                                            onChange={onChange}
                                            label="Enter Password"
                                            inputRef={ref}
                                            name={name}
                                            type="password"
                                            value={value}
                                            error={errors?.password && true}
                                            helperText={errors?.password?.message}
                                        />
                                    )}
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
        setToken: (payload) => dispatch({ type: LOGIN_SUCCESS, payload })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
