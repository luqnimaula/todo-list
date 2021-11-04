import React, {memo} from "react";
import loader from "@app/assets/images/loader.svg"

const CircularProgress = ({className}) => (
	<div className={`loader ${className}`}>
  		<img src={loader} alt="loader"/>
	</div>
);

export default memo(CircularProgress);