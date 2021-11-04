import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux"
import {hideMessage} from "@reduxActions/Common";
import {Modal, Icon} from "antd";
import $ from "jquery";

export default memo(() =>
{
    const dispatch = useDispatch();
    const errorMessage = useSelector(({common}) => common.error);
    const infoMessage = useSelector(({common}) => common.message);

    useEffect(() => {
        if (infoMessage)
        {
            Modal.info({
                title: <span data-cy="modal-information-title">{infoMessage}</span>,
                icon: <Icon type="info-circle" data-cy="modal-information-icon"/>,
                className: 'modal-alert-information',
                maskClosable: true,
                onCancel: () => {
                    dispatch(hideMessage());
                }
            });
            setTimeout(() => {
                $('.ant-modal-confirm-btns').remove()
                $('.modal-alert-information').attr('data-cy', 'modal-information');
            }, 50);
        }
    }, [infoMessage, dispatch]);

    useEffect(() => {
        if (errorMessage)
        {
            Modal.error({
                title: <span data-cy="modal-information-title">{errorMessage}</span>,
                icon: <Icon type="close-circle" data-cy="modal-information-icon"/>,
                className: 'modal-alert-information',
                maskClosable: true,
                onCancel: () => {
                    dispatch(hideMessage());
                }
            });
            setTimeout(() => {
                $('.ant-modal-confirm-btns').remove()
                $('.modal-alert-information').attr('data-cy', 'modal-information');
            }, 50);
        }
    }, [errorMessage, dispatch]);

    return null;
});