import React from 'react'
import axios from 'axios'
export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            incorrectPasswordCount: 0
        }
    }

    handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get('/api/authenticate', { auth: { username: this.state.email, password: this.state.password } });
            if (res.status === 200) {
                window.location = "/articles"
            }
        } catch (e) {
            this.setState({incorrectPasswordCount: this.state.incorrectPasswordCount += 1})
        }
    };

    render() {
        return (
            <div className='container vertical-center'>
                <div className="card mx-auto" style={{width: '26rem'}}>
                    <img className="card-img-top" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1703a672601%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1703a672601%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%2296.6%22%3E286x180%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="Card image cap"/>
                    <div className="card-body">
                        <h5 className="card-title">Sign in</h5>
                        <form>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Email address</label>
                                <input type="email" className="form-control" id="exampleInputEmail1"
                                       aria-describedby="emailHelp" placeholder="Enter email" onChange={e=> this.setState({email: e.target.value})}/>
                                    <small id="emailHelp" className="form-text text-muted">This should be the email you have supplied
                                        to us for registration.</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input type="password" className="form-control" id="exampleInputPassword1"
                                       placeholder="Password" onChange={e=> this.setState({password: e.target.value})}/>
                            </div>
                            <div className="form-check my-3">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                                    <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
                            </div>
                            <div className="d-flex justify-content-center">
                                <a href="#" className="btn btn-primary justify-content-center" style={{width: '100%'}} onClick={this.handleLogin}>Sign In</a>
                            </div>
                            <div className='mt-3' style={{display: this.state.incorrectPasswordCount === 0 ? 'none' : 'block', color: 'red', fontSize: '0.8rem'}}>Incorrect password attempts: {this.state.incorrectPasswordCount}</div>
                        </form>
                    </div>
                </div>
            </div>

        )
    }
}