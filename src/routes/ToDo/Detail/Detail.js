import React, {memo, useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams, useHistory} from "react-router-dom";
import {Row, Col, Modal, Dropdown, Menu, Icon, Form, Select, Input, Checkbox, Divider} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import axios from "@util/Api";
import RouteAccess from "@config/RouteAccess";
import {setError} from "@reduxActions/Common";
import {getTodoItems, setActiveItem, deleteItem, resetTodoItems, sortItems} from "@reduxActions/Todo";
import $ from "jquery";

const FormItem = Form.Item;
const {Option} = Select;

const priorities = [
	{
		title: 'Very High',
		value: 'very-high',
		styleName: 'todo-label-indicator todo-very-high',
	},
	{
		title: 'High',
		value: 'high',
		styleName: 'todo-label-indicator todo-high',
	},
	{
		title: 'Normal',
		value: 'normal',
		styleName: 'todo-label-indicator todo-normal',
	},
	{
		title: 'Low',
		value: 'low',
		styleName: 'todo-label-indicator todo-low',
	},
	{
		title: 'Very Low',
		value: 'very-low',
		styleName: 'todo-label-indicator todo-very-low',
	},
];

const StateItem = memo(({data}) =>
{
	const {slug} = useParams();
	const dispatch = useDispatch();
	const {id, title, priority, is_active} = data;
	const {styleName: priorityStyleName} = priorities.find(({value}) => value === priority) ?? {};

	const [active, setActive] = useState(is_active);
	useEffect(() => {
		setActive(is_active);
	}, [is_active]);

	const [checking, setChecking] = useState(false);
	const handleCheck = ({target}) =>
	{
		const {checked} = target;
		setChecking(true);
		dispatch(setActiveItem(id, !checked, () => {
			setActive(!checked);
			setChecking(false);
			dispatch(getTodoItems(slug));
		}));
	}

	return (
		<div className="todo-state-item todo-p-4" data-cy="todo-item">
			<Row gutter={[8,8]}>
				<Col xxl={1} xl={1} lg={1} md={1} sm={1} xs={2}>
					{checking ? (
						<LoadingOutlined className="todo-fs-lg"/>
					) : (
						<Checkbox
						checked={!active}
						onChange={handleCheck}
						className="todo-mr-2"
						data-cy="todo-item-checkbox"/>
					)}
				</Col>
				<Col xxl={1} xl={1} lg={1} md={1} sm={1} xs={2} className="todo-pt-2">
					{priorityStyleName && <div className={priorityStyleName} data-cy="todo-item-priority-indicator"/>}
				</Col>
				<Col xxl={20} xl={20} lg={20} md={20} sm={20} xs={18}>
					<div className="todo-d-inline-flex todo-justify-content-between todo-align-items-center">
						<p className={`todo-my-0 todo-font-weight-semi-bold ${!active && 'todo-text-item-completed'}`}
						data-cy="todo-item-title">
							{title}
							<EditState data={data}/>
						</p>
					</div>
				</Col>
				<Col xxl={2} xl={2} lg={2} md={2} sm={2} xs={2} className="todo-text-right">
					<ItemDelete {...data}/>
				</Col>
			</Row>
		</div>
	)
});

const ItemDelete = memo(({id, title}) =>
{
	const {slug} = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const handleShow = () => setShow((show) => !show);
	const onDelete = () =>
	{
		handleShow();
		setDeleting(true);
		dispatch(deleteItem(id, () => {
			setDeleting(false);
			dispatch(getTodoItems(slug));
		}));
	}

    setTimeout(() => {
        $('.modal-delete-item > .ant-modal-content').attr('data-cy', 'modal-delete');
    }, 1);

	return (
		<React.Fragment>
			{deleting ? <LoadingOutlined className="todo-fs-xl"/> : (
				<span className="todo-icon-trash todo-pointer"
				data-cy="todo-item-delete-button"
				onClick={handleShow}/>
			)}
			<Modal
			title=""
			footer={null}
			visible={show}
			closable={false}
			onCancel={handleShow}
			className="modal-delete-item"
			bodyStyle={{padding: 0}}
			transitionName=""
			maskTransitionName="">
				<div className="todo-w-100 todo-text-center todo-p-4"
				data-cy="modal-delete">
					<Icon
					type="warning"
					className="todo-text-danger todo-fs-iconcard"
					data-cy="modal-delete-icon"/>
					<h3 className="todo-my-4"
					data-cy="modal-delete-title">
						Apakah anda yakin ingin menghapus item <span className="todo-font-weight-semi-bold">"{title}"</span> ?
					</h3>
					<button
					className="todo-btn todo-mr-2"
					onClick={handleShow}
					data-cy="modal-delete-cancel-button">
						Batal
					</button>
					<button
					className="todo-btn todo-btn-danger"
					onClick={onDelete}
					data-cy="modal-delete-confirm-button">
						Hapus
					</button>
				</div>
			</Modal>
		</React.Fragment>
	)
});

const sorterList = [
	{
		title: 'Terbaru',
		value: 'newest',
		icon: 'todo-icon-sort-desc',
	},
	{
		title: 'Terlama',
		value: 'oldest',
		icon: 'todo-icon-sort-asc',
	},
	{
		title: 'A-Z',
		value: 'az',
		icon: 'todo-icon-sort-asc-alp',
	},
	{
		title: 'Z-A',
		value: 'za',
		icon: 'todo-icon-sort-desc-alp',	
	},
	{
		title: 'Belum Selesai',
		value: 'unifinished',
		icon: 'todo-icon-sort-unfinished',
	},
];

const Sorters = memo(() =>
{
	const dispatch = useDispatch();
	const {item_sorter} = useSelector(({todo}) => todo);

	const menu = (
	  	<Menu data-cy="sort-parent">
	  		{sorterList.map(({title, icon, value}) => (
			    <Menu.Item
			    onClick={() => dispatch(sortItems(value))}
			    key={value}
			    className="todo-py-2 todo-px-3"
			    data-cy="sort-selection">
			    	{icon && <span className={`${icon} todo-mr-2`} data-cy="sort-selection-icon"/>}
			    	<span data-cy="sort-selection-title">{title}</span>
			    	{item_sorter === value && <Icon type="check" className="todo-ml-3" data-cy="sort-selection-selected"/>}
			    </Menu.Item>
	  		))}
	  	</Menu>
	);

	return (
		<React.Fragment>
			<Dropdown
			overlay={menu}
			trigger={["click"]} 
            transitionName=""
            maskTransitionName="">
				<button className="todo-btn-sort todo-pointer" data-cy="todo-sort-button">
					<span className="todo-icon-sort"/>
				</button>
			</Dropdown>
		</React.Fragment>
	)
});

const AddState = Form.create()(memo(({form}) => 
{
	const {slug} = useParams();
	const {getFieldDecorator, validateFields, setFieldsValue} = form;
	const dispatch = useDispatch();

	const [show, setShow] = useState(false);
	const handleShow = () => setShow((value) => !value);

	const [loading, setLoading] = useState(false);
	const [allowSubmit, setAllowSubmit] = useState(false);
	const onCreateItem = (e) =>
	{
		if (e) e.preventDefault();
		validateFields((error, values) =>
		{
			if (!error && allowSubmit)
			{
				(async () => {
					const payload = {
						title: values?.name ?? '',
						priority: values?.priority ?? '',
						activity_group_id: slug
					};

					try {
						setLoading(true);
						await axios.post(RouteAccess.getApi('TODO_ACTIVITY_ITEM'), payload);
						handleShow();
						dispatch(getTodoItems(slug));
					} catch(error) {
						dispatch(setError(error));
					} finally {
						setLoading(false);
					}
				})();
			}
		});
	}

	useEffect(() => {
		if (show) setFieldsValue({name: '', priority: 'very-high'});
	}, [show, setFieldsValue]);

    setTimeout(() => {
        $('.modal-add-item > .ant-modal-content').attr('data-cy', 'modal-add');
    }, 1);

    useEffect(() =>
    {
    	if (form.getFieldValue('name') && form.getFieldValue('priority')) {
    		setAllowSubmit(true);
    	} else {
    		setAllowSubmit(false);
    	}
    },[form]);

	return (
		<React.Fragment>
			<button
			className="todo-btn todo-btn-primary"
			onClick={handleShow}
			data-cy="todo-add-button">
				<span className="todo-icon-plus todo-mr-2"/>
				Tambah
			</button>
			<Modal
			data-cy="modal-add"
			title={<h4 className="todo-font-weight-semi-bold" data-cy="modal-add-title">Tambah List Item</h4>}
			visible={show}
			onCancel={handleShow}
			closable={!loading}
			maskClosable={!loading}
			className="modal-add-item"
			bodyStyle={{padding: 0}}
			transitionName=""
			maskTransitionName=""
			footer={null}>
                <Form layout="vertical" onSubmit={onCreateItem} className="todo-py-4">
                	<FormItem
                	label={<span data-cy="modal-add-name-title">NAMA LIST ITEM</span>}
                	className="gx-mb-2 todo-font-weight-semi-bold todo-px-4">
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true, 
                                message: 'Mohon input nama list item'
                            }]
                        })(
                            <Input
                           	disabled={loading}
                           	data-cy="modal-add-name-input"
                           	className="todo-w-100"
                           	size="large"/>
                        )}
                    </FormItem>
                	<FormItem
                	label={<span data-cy="modal-add-priority-title">PRIORITY</span>}
                	className="gx-mb-2 todo-font-weight-semi-bold todo-px-4">
                        {getFieldDecorator('priority', {
                            rules: [{
                                required: true, 
                                message: 'Mohon pilih priority'
                            }],
                            initialValue: 'very-high'
                        })(
                        	<Select
                        	disabled={loading}
                        	placeholder="Pilih priority"
                        	size="large"
                        	data-cy="modal-add-priority-dropdown"
				            transitionName=""
				            maskTransitionName="">
                        		{priorities.map(({title, value, styleName}, index) => (
				              		<Option
				              		value={value}
				              		key={index}
				              		data-cy="modal-add-priority-item">
				              			<div className="todo-d-inline-flex todo-justify-content-between todo-align-items-center">
				              				<div className={styleName}/>{title}
				              			</div>
				              		</Option>
                        		))}
				            </Select>
                        )}
                    </FormItem>
                    <Divider/>
                    <div className="todo-w-100 todo-text-right todo-px-4">
                    	<button
						className="todo-btn todo-btn-primary"
						disabled={loading || !allowSubmit}
						type="submit"
						data-cy="modal-add-save-button">
							{loading ? <span><LoadingOutlined className="todo-fs-lg todo-mr-3"/>Menyimpan</span> : 'Simpan'}
						</button>
                    </div>
                </Form>
			</Modal>
		</React.Fragment>
	)
}));

const EditState = Form.create()(memo(({form, data}) => 
{
	const {getFieldDecorator, validateFields, setFieldsValue} = form;
	const {id, title, priority} = data;
	const {slug} = useParams();
	const dispatch = useDispatch();

	const [show, setShow] = useState(false);
	const handleShow = () => setShow((value) => !value);

	const [loading, setLoading] = useState(false);
	const onEditItem = (e) =>
	{
		if (e) e.preventDefault();
		validateFields((error, values) =>
		{
			if (!error)
			{
				(async () => {
					const payload = {
						title: values?.name ?? '',
						priority: values?.priority ?? ''
					};

					try {
						setLoading(true);
						await axios.patch(RouteAccess.getApi('TODO_ACTIVITY_ITEM_ID', {id}), payload);
						handleShow();
						dispatch(getTodoItems(slug));
					} catch(error) {
						dispatch(setError(error));
					} finally {
						setLoading(false);
					}
				})();
			}
		});
	}

	useEffect(() => {
		if (show) setFieldsValue({name: title, priority: priority});
	}, [show, title, priority, setFieldsValue]);

	return (
		<React.Fragment>
			<span className="todo-icon-state-item todo-ml-3 todo-pointer"
			data-cy="todo-item-edit-button"
			onClick={handleShow}/>
			<Modal
			title={<h4 className="todo-font-weight-semi-bold">Edit Item</h4>}
			visible={show}
			onCancel={handleShow}
			closable={!loading}
			maskClosable={!loading}
			transitionName=""
			maskTransitionName=""
			footer={(
				<button
				className="todo-btn todo-btn-primary"
				disabled={loading}
				onClick={onEditItem}>
					{loading ? <span><LoadingOutlined className="todo-fs-lg todo-mr-3"/>Menyimpan</span> : 'Simpan'}
				</button>
			)}>
                <Form layout="vertical" onSubmit={onEditItem}>
                	<FormItem
                	label="NAMA LIST ITEM"
                	className="gx-mb-2 todo-font-weight-semi-bold">
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true, 
                                message: 'Mohon input nama list item'
                            }]
                        })(
                            <Input
                            disabled={loading}
                            className="todo-w-100"
                            size="large"/>
                        )}
                    </FormItem>
                	<FormItem
                	label="PRIORITY"
                	className="gx-mb-2 todo-font-weight-semi-bold">
                        {getFieldDecorator('priority', {
                            rules: [{
                                required: true, 
                                message: 'Mohon pilih priority'
                            }]
                        })(
                        	<Select
                        	disabled={loading}
                        	placeholder="Pilih priority"
                        	size="large"
				            transitionName=""
				            maskTransitionName="">
                        		{priorities.map(({title, value, styleName}, index) => (
				              		<Option
				              		value={value}
				              		key={index}>
				              			<div className="todo-d-inline-flex todo-justify-content-between todo-align-items-center">
				              				<div className={styleName}/>{title}
				              			</div>
				              		</Option>
                        		))}
				            </Select>
                        )}
                    </FormItem>
                </Form>
			</Modal>
		</React.Fragment>
	)
}));

export default memo(() => 
{
	const dispatch = useDispatch();
	const history = useHistory();
	const {slug} = useParams();

	const [editable, setEditable] = useState(false);
	useEffect(() => {
		if (editable) document.getElementById('edit-activity-title').focus();
	}, [editable]);

	const [record, setRecord] = useState(null);
	const [actTitle, setActTitle] = useState('');
	useEffect(() => {
		(async () => {
			try {
				const request = await axios.get(RouteAccess.getApi('TODO_ACTIVITY_ID', {id: slug}));
				const {data} = request ?? {};
				setRecord(data);
			} catch(error) {
				dispatch(setError(error));
			}
			dispatch(getTodoItems(slug));
		})();

		return () => dispatch(resetTodoItems());
	}, [slug, dispatch]);

	const {title} = record ?? {};

	useEffect(() => setActTitle(title), [title]);

	const onChangeTitle = async () =>
	{
		setEditable(!editable);
		try {
			await axios.patch(RouteAccess.getApi('TODO_ACTIVITY_ID', {id: slug}), {title: actTitle});
		} catch(error) {
			dispatch(setError(error));
		}
	}

	const {item_loading, item_data} = useSelector(({todo}) => todo);

	return (
		<div className="todo-w-100">
			<div className="todo-d-flex todo-justify-content-between todo-my-4 todo-align-items-center">
				<div className="todo-d-inline-flex todo-justify-content-between todo-align-items-center">
					<span
					className="todo-icon-back todo-mr-2 todo-pointer"
					data-cy="todo-back-button"
					onClick={() => history.push('/')}/>
					{editable ? (
						<input
						id="edit-activity-title"
						type="text"
						value={actTitle}
						onChange={({target}) => setActTitle(target.value)}
						className="todo-activity-edit todo-font-weight-semi-bold"
						data-cy="todo-title"
						onBlur={onChangeTitle}/>
					) : (
						<h1 className="todo-my-0 todo-font-weight-semi-bold"
						data-cy="todo-title"
						onClick={() => setEditable(!editable)}>
							{actTitle}
						</h1>
					)}
					<span className="todo-icon-edit todo-ml-3 todo-pointer"
					data-cy="todo-title-edit-button"
					onClick={() => setEditable(!editable)}/>
				</div>
				<div>
					<Sorters/>
					<AddState/>
				</div>
			</div>
			{item_loading && (
				<div className="todo-w-100 todo-text-center">
					<LoadingOutlined className="todo-fs-icon-lg todo-text-primary"/>
				</div>
			)}
			<Row gutter={[8,8]}>
				{(item_data && item_data.length) ? 
					item_data.map((row, index) => (
						<Col span={24} key={index} className="todo-mb-2">
				        	<StateItem data={row}/>
					    </Col>
					))
				: (
					<Col span={24}>
						<div className="todo-w-100 todo-text-center todo-wrapper-container">
							<span className="todo-state-empty" data-cy="todo-empty-state"/>
						</div>
				    </Col>
				)}
			</Row>
		</div>
	)
});