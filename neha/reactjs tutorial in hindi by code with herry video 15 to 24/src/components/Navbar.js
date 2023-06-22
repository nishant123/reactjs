import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function Navbar(props) {
    return (
        <nav className={`navbar navbar-expand-lg navbar-${props.Mode} bg-${props.Mode}`} >
            <div className="container-fluid">
                <link className="navbar-brand" to="/about">{props.title}</link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <link className="nav-link active" aria-current="page" to="/">Home</link>
                        </li>
                        <li className="nav-item">
                            <link className="nav-link" to="/">About</link>
                        </li>
                        <li className="nav-item dropdown">
                            <link className="nav-link dropdown-toggle" to="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Dropdown
                            </link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><link className="dropdown-item" to="/">Action</link></li>
                                <li><link className="dropdown-item" to="/">Another action</link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><link className="dropdown-item" to="/">Something else here</link></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <link className="nav-link disabled">{props.aboutText}</link>
                        </li>
                    </ul>

                    {/*<form className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
    </form>*/}

                    <div classNmae="d-flex">
                        <div className="bg-primary rounded mx-2" style={{ height: '30px', width: '30px', cursor: 'pointer' }}>
                            <div className="bg-danger rounded mx-2" style={{ height: '30px', width: '30px', cursor: 'pointer' }}>
                                <div className="bg-success rounded mx-2" style={{ height: '30px', width: '30px', cursor: 'pointer' }}>
                                    <div className="bg-warning   rounded mx-2" style={{ height: '30px', width: '30px', cursor: 'pointer' }}>
                                    </div>

                                </div>

                                <div className="form-check form-switch">
                                    <input className="form-check-input" onClick={props.toggleMode} type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                                    <label className="form-check-label" for="flexSwitchCheckDefault">Enable Drak Mode</label>
                                </div>
                            </div>
                        </div>
                    </ nav>
                    )
}
                    Navbar.propTypes = {
                        title: PropTypes.string.isRequired,
                    aboutText: PropTypes.string.isRequired
} 