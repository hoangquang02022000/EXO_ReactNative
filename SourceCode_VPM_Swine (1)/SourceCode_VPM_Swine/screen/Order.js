import React, { Component } from 'react';
import { Fragment } from 'react';
import { CheckUserRule, UserType } from '../func';
import UserOrder from './Users/UserOrder';
import UserReport from './Users/UserReport';
class Order extends Component {
    state = {
        rule: ""
    }

    async componentDidMount() {
        this.props.navigation.addListener("focus", async () => {
            console.log("order recall")
            let rule = await CheckUserRule();
            this.setState({ rule });
        })
    }

    render() {
        let { rule } = this.state;
        let views = null;
        console.log("render order recall: " ,rule);
        if (rule===UserType.User){
            views = <UserOrder {...this.props}/>
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

export default Order;
