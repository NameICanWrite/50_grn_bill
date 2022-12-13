import Post from "./post.js"
import { deleteFileFromGoogleDrive, uploadFileToGoogleDrive } from "../utils/file-upload/googleDrive.utils.js"

export async function getPost(req, res, next) {
const post = await Post.findById(req.params.postId)
post.likes = post.likedBy.length
if (!req.auth.isAdmin) {
	post.likedBy = undefined
}
console.log(post)
res.send(post)
}


export async function getAllPosts(req, res, next) {
const posts = await Post.find({})
console.log(posts)
posts.forEach(post => {
	post.likes = post.likedBy.length
	if (!req.auth.isAdmin) {
		post.likedBy = undefined
	}
})

res.send(posts)
}


export async function addPost(req, res, next) {
const post = req.body
const user = req.user
const {uid} = req.auth.uid

await Post.create({
  ...post,
  author: user._id,
	date: new Date().toISOString()
})
if (user.didAddPost == false) {
	user.didAddPost = true
	await user.save()
}

res.send("post added successfully")
}


export async function likePost(req, res, next) {
	const post = await Post.findById(req.params.postId)
	const { uid } = req.auth
	const user = req.user

	if (post.likedBy.includes(uid)) return res.status(400).send('you already liked this post')
	post.likedBy.push(uid)
	await post.save()
	console.log(user.didLikePost)
	console.log(!user.didLikePost)
	if (!user.didLikePost) {
		user.didLikePost = true
		await user.save()
	}
	res.send('You liked post ' + req.params.postId)
}

export async function removeLike(req, res, next) {
	const post = await Post.findById(req.params.postId)
	const { uid } = req.auth

	if (!post.likedBy.includes(uid)) return res.status(400).send('you have not liked this post yet')

	post.likedBy = post.likedBy.filter(nextUid => nextUid != uid)
	await post.save()
	res.send('You removed like from  post ' + req.params.postId)
}


export async function editPost(req, res, next) {
	const newPost = req.body

	req.post.header = newPost.header
	req.post.text = newPost.text

	req.post.save()

	res.send("post edited successfully id: " + req.post.id)
}

export async function deletePost(req, res, next) {
const post = req.post
for (let index in post.images) {
	await deleteFileFromGoogleDrive(post.images[index])
}

await Post.findByIdAndDelete(req.post._id)
res.send("post deleted successfully id: " + id)
}

export async function addPostImages(req, res, next) {
	const post = req.post
	console.log(req.body)
	console.log('id:')
	console.log(post._id)

	const images = req.files
	
	for (let prop in images) {
	 const image = images[prop]
	 const fileName = `${Date.now()}${image.name}`

	 const fileId = (await uploadFileToGoogleDrive({ ...image, name: fileName })).id

	 post.images.push(fileId)
	}

	await post.save()
	console.log('images ids added:')
	console.log(post.images)
	return res.status(200).send('images added successfully')
}



export async function removePostImages(req, res, next) {
  const post = req.post
	const imageIds = req.body.imageIds

	for (const index in imageIds) {
		await deleteFileFromGoogleDrive(imageIds[index])
	}

	post.images = post.images.filter(item => !imageIds.includes(item))

	await post.save()
	console.log(post.images)
	res.status(200).send('images removed successfully')
}


export async function getPostByIdAndConfirmOwner(req, res, next) {
	const id = req.body.id || req.body._id || req.params.postId
	const post = await Post.findById(id)

	if (!(post.author.id === req.auth.uid)) return req.status(400).send('It\'s not your post!')
	req.post = post

	next()
}

