import React, {memo, Suspense, lazy} from "react";
import {Route, Switch} from "react-router-dom";
import FallbackContent from "@app/components/FallbackContent";

export default memo(({match}) => (
	<Suspense fallback={<FallbackContent/>}>
        <Switch>
	        <Route path={`${match.url}`} component={lazy(() => import('./ToDo'))}/>
        </Switch>
    </Suspense>
));