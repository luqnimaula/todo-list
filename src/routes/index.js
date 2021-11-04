import React, {memo, Suspense, lazy} from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import FallbackContent from "@app/components/FallbackContent";

export default memo(({match}) => (
	<Suspense fallback={<FallbackContent/>}>
        <Switch>
	        <Route path={`${match.url}todo`} component={lazy(() => import('./ToDo'))}/>
	        <Redirect to="/todo"/>
        </Switch>
    </Suspense>
));