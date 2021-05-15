import axios from "axios";

const login = (username, password, next, err) => {
    axios
        .post('api/user/login',{
            username,
            password
        })
        .then((res) => {
            // axios.post('/echo',res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user))
            next(res.data.user);
        })
        .catch(error => err(error.response.data.error));
}

const logout = (next, err) => {
    axios
        .get('api/user/logout')
        .then((res) => {
            // axios.post('/echo',res.data.user);
            localStorage.removeItem('user');
            next(res.data);
        })
        .catch(error => err(error));
}

const register = (userData, next, err) => {
    console.log('Register');
    axios
        .post('api/user/register', userData)
        .then(res => {
            localStorage.setItem('user', JSON.stringify(res.data.user))
            next(res.data.user);
        })
        .catch(error => err(error.response.data.error));
}

const userServices = {
    login,
    logout,
    register
}

export default userServices;