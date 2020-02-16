import React from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'

export class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        }
    }

    async componentDidMount() {
        const res = await axios.get('/api/getUserInfo');
        this.setState({userInfo: res.data})
    }

    handleLogout = async () => {
        await axios.get('/api/logout');
        this.setState({userInfo: {}});
        window.location = "/"
    };

    isEmptyObject = (obj) => {
        return Object.entries(obj).length === 0 && obj.constructor === Object
    };

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <NavLink to="/"><div className='navbar-brand'>Hear Me Out</div></NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink to="/articles"><div className='nav-link'>Articles</div></NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/new_article"><div className='nav-link'>New Article</div></NavLink>
                        </li>
                        <li className="nav-item" style={{display: this.isEmptyObject(this.state.userInfo) ? 'none' : 'block'}}>
                           <div className='nav-link' onClick={this.handleLogout}>Logout</div>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}