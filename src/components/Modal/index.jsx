import React, { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import styles from './modal.module.scss';
import { useForm } from 'react-hook-form';
import axios from '../../axios';

export const Modal = ({ setIsOpen }) => {
	const [error, setError] = useState('');
	const {
		reset,
		register,
		handleSubmit,
		formState: { errors, isValid }
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			oldPassword: '',
			newPassword: '',
			confirmedPassword: ''
		}
	});
	const ref = useRef(null);

	function handleClose(e) {
		if (!ref.current?.contains(e.target)) {
			setIsOpen(false);
		}
	}

	const onSubmit = async (values) => {
		try {
			let response = await axios.patch('/edit-pw', values);
			if (response.status !== 200) {
				throw response;
			}
			reset();
			setError('Success');
		} catch (err) {
			const message = err.response.data.message ? err.response.data.message : 'Wrong password!';
			setError(message);
		}
	};

	return (
		<div className={styles.overlay} onClick={handleClose}>
			<div className={styles.content} ref={ref}>
				<button className={styles.closeBtn} onClick={() => setIsOpen(false)}></button>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextField
						className={styles.field}
						label="Old Password"
						error={Boolean(errors.oldPassword?.message)}
						helperText={errors.oldPassword?.message}
						{...register('oldPassword', { required: 'Укажите Пароль' })}
						fullWidth
					/>
					<TextField
						className={styles.field}
						label="New Password"
						error={Boolean(errors.newPassword?.message)}
						helperText={errors.newPassword?.message}
						{...register('newPassword', { required: 'Укажите Пароль' })}
						fullWidth
					/>
					<TextField
						className={styles.field}
						label="Confirm Password"
						error={Boolean(errors.confirmedPassword?.message)}
						helperText={errors.confirmedPassword?.message}
						{...register('confirmedPassword', { required: 'Укажите Пароль' })}
						fullWidth
					/>
					<Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
						Save
					</Button>
					{error && <p className={styles.error}>{error}</p>}
				</form>
			</div>
		</div>
	);
};
