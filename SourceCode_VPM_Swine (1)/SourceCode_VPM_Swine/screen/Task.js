import React, { Component } from 'react';
import { Fragment } from 'react';
import { CheckUserRule, UserType } from '../func';
import Etask from './Engineers/Etask';
import MEtask from './ManageEngineers/MEtask';
import MUReport from './ManageUsers/MUReport';
import UserMaintenance from './Users/UserMaintenance';

class Task extends Component {
    state = {
        rule: ""
    }

    async componentDidMount() {
        let rule = await CheckUserRule();
        this.setState({ rule });
    }

    render() {
        let { rule } = this.state;
        let views = null;
        if (rule === UserType.User) {
            // views = <UserStatus {...this.props} />
            views = <UserMaintenance {...this.props} />
        }
        if (rule===UserType.ManageUser){
            views = <MUReport {...this.props}/>
        }
        if (rule===UserType.Engineer){
            views = <Etask {...this.props}/>
        }
        if (rule===UserType.ManageEngineer){
            views = <MEtask {...this.props}/>
        }
        return (
            <Fragment>
                {views}
            </Fragment>
        );
    }
}

export default Task;
