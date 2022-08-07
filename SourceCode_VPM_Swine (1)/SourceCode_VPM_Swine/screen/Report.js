
import UserReport from './Users/UserReport';
import React, { Component, Fragment } from 'react';
import { CheckUserRule, UserType } from '../func';

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rule: ""
        };
    }
    async componentDidMount() {
        let rule = await CheckUserRule();
        this.setState({ rule });
    }
    render() {
        let { rule } = this.state;
        console.log("UserReport: ",rule);
        let views = null;
        if (rule === UserType.User) {
            // views = <UserStatus {...this.props} />
            views = <UserReport {...this.props} />
        }
        else if (rule===UserType.ManageUser){
            views = <UserReport {...this.props}/>
        }
        return (
            <Fragment>
                {views}
            </Fragment>
        );
    }
}

export default Report;
