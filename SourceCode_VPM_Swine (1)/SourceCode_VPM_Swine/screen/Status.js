import React, { Component } from 'react';
import { Fragment } from 'react';
import { CheckUserRule, UserType } from '../func';
import EStatus from './Engineers/EStatus';
import MEStatus from './ManageEngineers/MEStatus';
import MUStatus from './ManageUsers/MUStatus';
import UserMayPhat from './Users/UserMayPhat';

class Status extends Component {
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
            views = <UserMayPhat {...this.props} />
        }
        if (rule === UserType.ManageUser) {
            views = <MUStatus {...this.props} />
        }
        if (rule === UserType.Engineer) {
            views = <EStatus {...this.props} />
        }
        if (rule === UserType.ManageEngineer) {
            views = <MEStatus {...this.props} />
        }
        return (
            <Fragment>
                {views}
            </Fragment>
        );
    }
}

export default Status;
