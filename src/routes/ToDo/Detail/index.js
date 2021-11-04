import React, {memo} from "react";
import {Route, Switch} from "react-router-dom";
import Detail from "./Detail";

export default memo(({match}) => (
    <Switch>
        <Route path={`${match.url}/:slug`} component={Detail}/>
    </Switch>
));