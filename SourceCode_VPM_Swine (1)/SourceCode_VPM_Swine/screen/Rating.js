import React, { Component } from 'react';
import { Fragment } from 'react';
import { CheckUserRule, UserType } from '../func';
import UserTools from './Users/UserTools';

class Rating extends Component {
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
        if (rule===UserType.User){
            views = <UserTools {...this.props}/>
        }
        return (
            <Fragment>
                {views}
            </Fragment>
        );
    }
}

export default Rating;
