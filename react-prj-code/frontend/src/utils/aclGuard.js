import React, { Component } from 'react'
import permissionCheck from './permissionCheck'
class AclGuard extends Component {
  constructor(props) {
    super(props)
  }
  getAccess = () => {
    let access = false
    if (!this.props.entity ) {
      return access
    }
    access = permissionCheck(this.props.entity, this.props.action)
    return access
  }
  render() {
    const { children } = this.props
    return (
      <React.Fragment>
        {this.getAccess() ? children : null}
      </React.Fragment>
    )
  }
}
export default AclGuard