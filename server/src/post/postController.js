import Post from "./post.js"
import { deleteFileFromGoogleDrive, uploadFileToGoogleDrive } from "../utils/file-upload/googleDrive.utils.js"

import makeUrlScreenshot from "../utils/makeUrlScreenshot.js";
import { file } from "googleapis/build/src/apis/file/index.js";
import fs from "fs";
import axios from "axios";
import urlExists from "../utils/urlExists.js";
import getLinkPreviewCustom from "../utils/linkPreview.utils.js";

// import urlExists from 'url-exist'

// console.log(await urlExists('https://www.quora.com'));

const postTags = [
	'social media',
	'tech',
	'viral',
	'commerce',
	'giant',
	'disruptive'
]

export async function getPost(req, res, next) {
const post = await Post.findById(req.params.postId)
post.likes = post.likedBy.length
if (!req.auth.isAdmin) {
	post.likedBy = undefined
}
res.send(post)
}


export async function getAllPosts(req, res, next) {
const posts = await Post.find({})
posts.forEach(post => {
	post.likes = post.likedBy.length
	// if (!req.auth?.isAdmin) {
	// 	post.likedBy = undefined
	// }
})

res.send(posts)
}


export async function addPost(req, res, next) {
let {website, tags = [], isImageNeeded} = req.body
const user = req.user

console.log(isImageNeeded);

// validate url
let websiteExists
websiteExists = (await urlExists(website)) 
if (!websiteExists && !/^https?:\/\//i.test(website)) {
		website = 'https://' + website
    websiteExists = (await urlExists(website)) 
		if (!websiteExists) {
			website = 'http://' + website
    	websiteExists = (await urlExists(website)) 
		}
}
if (!websiteExists) return res.status(400).send('You should post only existing website')



	const linkPreview = await getLinkPreviewCustom({url: website, isImageNeeded})

	//if cant get metadata image
	const isScreenshotNeeded = (!linkPreview.imageUrl && isImageNeeded)
	if (isScreenshotNeeded) {
		const screenshot = await makeUrlScreenshot(website)
		linkPreview.screenshotFileId = (await uploadFileToGoogleDrive(screenshot)).id
		fs.unlinkSync(screenshot.path)
	}


tags = tags.filter(tag => postTags.includes(tag))
const post = await Post.create({
  website,
	tags,
  author: user._id,
	date: new Date().toISOString(),
	// images: fileId ? [fileId] : []
	linkPreview
})

if (user.didAddPost == false) {
	user.didAddPost = true
	await user.save()
}

console.log('post added');
console.log(post);

res.send({
	message: "post added successfully",
	post
})
}


export async function likePost(req, res, next) {
	const post = await Post.findById(req.params.postId)
	const { uid, isAdmin } = req.auth
	const user = req.user

	if (post.likedBy.includes(uid) 
		// && !isAdmin
	) return res.status(400).send('you already liked this post')
	post.likedBy.push(uid)
	await post.save()

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

	// req.post.header = newPost.header
	// req.post.text = newPost.text

	// await req.post.save()

	// res.send("post edited successfully id: " + req.post.id)

	res.status(400).send("rejected")
}

export async function deletePost(req, res, next) {
const post = req.post
for (let index in post.images) {
	await deleteFileFromGoogleDrive(post.images[index])
}

await Post.findByIdAndDelete(req.post._id)
res.send("post deleted successfully id: " + req.post._id)
}

export async function deleteAllPosts(req, res, next) {
	const posts = await Post.find({})
	for (let i in posts) {
		const post = posts[i]
		for (let index in post.images) {
				await deleteFileFromGoogleDrive(post.images[index])
		}
	}
	
	await Post.deleteMany({})
	res.send("all posts deleted successfully ")
}



export async function addPostImages(req, res, next) {
	const post = req.post
	console.log(req.body)
	console.log('id:')
	console.log(post._id)

	const images = req.files

	console.log(req.files);
	
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

export async function addPostImage(req, res, next) {
	const post = req.post
	console.log(req.body)
	console.log('id:')
	console.log(post._id)

	const image = req.files.postImage

	console.log(req.files);
	

	 const fileName = `${Date.now()}${image.name}`

	 const fileId = (await uploadFileToGoogleDrive({ ...image, name: fileName })).id

	 post.linkPreview.screenshotFileId = fileId
	

	await post.save()
	console.log('images ids added:')
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

	if (!(post.author === req.auth.uid) && !req.auth.isAdmin) return res.status(400).send('It\'s not your post!')
	req.post = post

	next()
}
