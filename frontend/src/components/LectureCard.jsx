import * as React from 'react'
import { Card, CardContent, CardMedia, Button, Rating, IconButton, Chip } from '@mui/material'
import { useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import BalanceIcon from '@mui/icons-material/Balance'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import { addElement, searchResult } from './../store/store.js'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

// tooltip에 스타일 주기
const LightTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 11,
	},
}))

function LectureCard({lecture}) {
	const navigate = useNavigate()
	// 비교 강의 추가할때 쓰는 변수
	let dispatch = useDispatch()

	// 호버용 변수
	const [hover, setHover] = useState(false)
	const hoverStyle = {
		position: 'relative',
		height: 340,
		cursor: hover ? 'pointer' : 'none',
		boxShadow: hover ? "0px 4px 8px 0px rgba(0, 0, 0, 0.2)" : 'none',
	}

	// 좋아요용 변수
	const [like, setLike] = useState(false)
	const toggleLike = () => setLike(!like)


	// 디테일 페이지로 가기
	const goDetail = function() {
		navigate(`/lecture/detail/${lecture.lectureId}`)
	}
	// 강의 담았을 때 알림 (sweetAlert용)
	const Toast = Swal.mixin({
		toast: true,
		position: "bottom-start",
		showConfirmButton: false,
		timer: 2000,
		didOpen: (toast) => {
			toast.onmouseenter = Swal.stopTimer;
			toast.onmouseleave = Swal.resumeTimer;
		}
	})
	
	// 강의 담겼을 때 or 3개 다 차면 안된다고 해주기
	let compareLectures = useSelector((state) => state.compareLectures)
	function addCart() {
		if (compareLectures.length < 3) {
			dispatch(addElement(lecture))
			Toast.fire({
				icon: "success",
				title: "강의 비교하기에 담겼습니다."
			});
		} else {
			Swal.fire({
				icon: "error",
				title: "강의가 3개 이상입니다",
				text: "비교할 수 있는 강의는 최대 3개입니다.",
			});
		}
	}

	return (
		<Card
			variant="outlined"
			style={hoverStyle}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<CardMedia
				sx={{ height: 140 }}
				image={lecture.image}
				title="lecture image"
			/>
			<CardContent style={{ padding: '13px' }}>
				<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
					<div style={{ height: '70px' }}>
						<p style={{ fontWeight: '700', fontSize: '1.1em' }}>{lecture.lectureName}</p>
					</div>
					<div>
						<p style={{ marginBottom: '5px' }}>{lecture.instructor}<br /><Rating value={lecture.combinedRating} readOnly></Rating></p>
					</div>
					{/* 해시태그들(2개까지만) */}
					<div>
						{
							lecture.tagList.length == 1 ? (<div>{
								<Chip size="small" label={`# ${lecture.tagList[0].name}`}></Chip>
							}</div>) : (<div>{
								lecture.tagList.length == 2 ? (<div>
									<Chip size="small" label={`# ${lecture.tagList[0].name}`}></Chip>
									<Chip size="small" label={`# ${lecture.tagList[1].name}`}></Chip>
								</div>) : null
								}</div>)
						}
					</div>
				</div>
			</CardContent>
			{
				// 호버했을 때
				hover == true ? (
					<div
						style={{
							position: 'absolute',
							top: 0,
							backgroundColor: 'rgba(29, 35, 100, 0.9)',
							width: '100%',
							height: '100%',
							color: 'white',
							padding: '15px',
							display: 'flex',
							flexDirection: 'column'
						}}
					>
						<div>
							<p style={{ fontWeight: '700', fontSize: '1.3em', margin:0 }} onClick={goDetail}>{lecture.lectureName}</p>
						</div>
					
						<div style={{ height: '70%' }} onClick={goDetail}>
							<p>{lecture.descriptionSummary}<br />총 {lecture.totalTime}시간<br />{lecture.level}</p>
						</div>
						<div style={{ height: '20%' }} onClick={goDetail}>
							<Button size="small" sx={{ backgroundColor: 'RGB(83, 96, 245)', color: 'white', borderRadius: '20px', marginRight: '0.5em' }}>#VSCode</Button>
						</div>
						<div style={{ marginLeft: '75%', display: 'flex', flexDirection: 'column' }}>
							{
								like ? (
									<LightTooltip slotProps={{popper: {modifiers: [{name: 'offset', options: {offset: [0, -15],},},]},}} placement="left" arrow title="좋아요 취소">
										<IconButton size='small' onClick={toggleLike} sx={{ color: 'white' }}>
											<FavoriteIcon />
										</IconButton>
									</LightTooltip>
								) : (
									<LightTooltip slotProps={{popper: {modifiers: [{name: 'offset', options: {offset: [0, -15],},},]},}} placement="left" arrow title="좋아요">
										<IconButton size='small' onClick={toggleLike} sx={{ color: 'white' }}>
											<FavoriteBorderIcon />
										</IconButton>
									</LightTooltip>
								)
							}
							<LightTooltip slotProps={{popper: {modifiers: [{name: 'offset', options: {offset: [0, -15],},},]},}} placement="left" arrow title="강의 비교하기">
								<IconButton size='small' sx={{ color: 'white' }} onClick={addCart}>
									<BalanceIcon />
								</IconButton>
							</LightTooltip>

						</div>
					</div>
				) : null
			}
		</Card>
	)
}

export default LectureCard