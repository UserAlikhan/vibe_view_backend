// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// const bars = [
//     {
//         coordinates: {
//             latitude: 40.730824,
//             longitude: -73.990383,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//         },
//         idx: 1,
//         address: "30 Water St",
//         zipCode: "10004",
//         city: "New York",
//         state: "NY",
//         name: "The Dead Rabbit",
//         description: "Known for its classic cocktails and speakeasy vibe, The Dead Rabbit is a must-visit for any cocktail enthusiast.",
//         rating: 4.8,
//         images: [
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6C90CIMJgb6P25VLZTA2x7oZm10J0E8Mlbw&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzqQV0sM2Oyix5i9bw6kGk5oPgRT2VhSc61Q&s",
//             "https://media-cdn.tripadvisor.com/media/photo-s/0b/43/14/0f/20160513-152127-largejpg.jpg",
//         ],
//     },
//     {
//         coordinates: {
//             latitude: 40.721484,
//             longitude: -73.987847,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//         },
//         idx: 2,
//         address: "113 St Marks Pl",
//         zipCode: "10009",
//         city: "New York",
//         state: "NY",
//         name: "PDT (Please Don't Tell)",
//         description: "A hidden gem, PDT is a sophisticated cocktail bar with a menu that changes seasonally.",
//         rating: 4.7,
//         images: [
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwCT_nr4fWFFxGVxriZ9ASbSn5fLORww4S5g&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaGwRFxgdpUqDfj5vP9XhIaQ_bQ-t6lEvuXw&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGG-JZw7wV7tsEqsUQN7mvzjcAtbRJGQYZMQ&s",
//         ]
//     },
//     {
//         coordinates: {
//             latitude: 40.731142,
//             longitude: -73.996887,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//         },
//         idx: 3,
//         address: "1154 1st Ave.",
//         name: "The Spotted Pig",
//         zipCode: "10065",
//         city: "New York",
//         state: "NY",
//         description: "A cozy, neighborhood bar with a wide selection of craft beers and a menu of classic American bar food.",
//         rating: 4.6,
//         images: [
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/The_Spotted_Pig.jpg/250px-The_Spotted_Pig.jpg",
//             "https://cdn.vox-cdn.com/thumbor/CEUBffgRqxPOtkZFiFayeQR2S1U=/0x0:512x384/1200x0/filters:focal(0x0:512x384):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/19630424/Attachment.jpg",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRERVsVyGu_rJa_APtq8rhWqrAC1AABi7V7Dw&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-yR6hnDSJKiwWCDA1B5WNjxFhQX2r_fMniQ&s"
//         ]
//     },
//     {
//         coordinates: {
//             latitude: 40.728926,
//             longitude: -73.988229,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//         },
//         idx: 4,
//         address: "510 Hudson St",
//         zipCode: "10014",
//         city: "New York",
//         state: "NY",
//         name: "Employees Only",
//         description: "A speakeasy-style bar with a menu of classic and modern cocktails, as well as a selection of wines and beers.",
//         rating: 4.5,
//         images: [
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwCT_nr4fWFFxGVxriZ9ASbSn5fLORww4S5g&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaGwRFxgdpUqDfj5vP9XhIaQ_bQ-t6lEvuXw&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGG-JZw7wV7tsEqsUQN7mvzjcAtbRJGQYZMQ&s",
//         ]
//     },
//     {
//         coordinates: {
//             latitude: 40.740656,
//             longitude: -73.989559,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//         },
//         idx: 5,
//         address: "80 Columbus Cir",
//         zipCode: "10023",
//         city: "New York",
//         state: "NY",
//         name: "The Aviary",
//         description: "A high-end cocktail bar with a focus on innovation and experimentation, featuring a menu of unique and delicious drinks.",
//         rating: 4.4,
//         images: [
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6C90CIMJgb6P25VLZTA2x7oZm10J0E8Mlbw&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzqQV0sM2Oyix5i9bw6kGk5oPgRT2VhSc61Q&s",
//             "https://media-cdn.tripadvisor.com/media/photo-s/0b/43/14/0f/20160513-152127-largejpg.jpg",
//         ]
//     },
//     {
//         coordinates: {
//             latitude: 40.718928,
//             longitude: -73.990383,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//         },
//         idx: 6,
//         address: "180 Orchard St 15th floor",
//         zipCode: "10002",
//         city: "New York",
//         state: "NY",
//         name: "The Bowery Hotel Bar",
//         description: "A historic bar with a classic atmosphere, serving a wide selection of drinks and a menu of American bar food.",
//         rating: 4.3,
//         images: [
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwCT_nr4fWFFxGVxriZ9ASbSn5fLORww4S5g&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaGwRFxgdpUqDfj5vP9XhIaQ_bQ-t6lEvuXw&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGG-JZw7wV7tsEqsUQN7mvzjcAtbRJGQYZMQ&s",
//         ]
//     },
//     {
//         coordinates: {
//             latitude: 40.748817,
//             longitude: -73.985664,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//         },
//         idx: 7,
//         address: "210 Smith St",
//         zipCode: "11201",
//         city: "Brooklyn",
//         state: "NY",
//         name: "The Clover Club",
//         description: "A sophisticated cocktail bar with a menu of classic and modern drinks, as well as a selection of wines and beers.",
//         rating: 4.2,
//         images: [
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6C90CIMJgb6P25VLZTA2x7oZm10J0E8Mlbw&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzqQV0sM2Oyix5i9bw6kGk5oPgRT2VhSc61Q&s",
//             "https://media-cdn.tripadvisor.com/media/photo-s/0b/43/14/0f/20160513-152127-largejpg.jpg",
//         ]
//     },
//     {
//         coordinates: {
//             latitude: 40.726892,
//             longitude: -73.996506,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//         },
//         idx: 8,
//         address: "131 Sullivan St",
//         zipCode: "10012",
//         city: "New York",
//         state: "NY",
//         name: "The Dutch",
//         description: "A cozy, neighborhood bar with a wide selection of craft beers and a menu of classic American bar food.",
//         rating: 4.1,
//         images: [
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/The_Spotted_Pig.jpg/250px-The_Spotted_Pig.jpg",
//             "https://cdn.vox-cdn.com/thumbor/CEUBffgRqxPOtkZFiFayeQR2S1U=/0x0:512x384/1200x0/filters:focal(0x0:512x384):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/19630424/Attachment.jpg",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRERVsVyGu_rJa_APtq8rhWqrAC1AABi7V7Dw&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-yR6hnDSJKiwWCDA1B5WNjxFhQX2r_fMniQ&s"
//         ]
//     },
//     {
//         coordinates: {
//             latitude: 40.732660,
//             longitude: -73.998478,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//         },
//         idx: 9,
//         address: "253 5th Ave",
//         zipCode: "10016",
//         city: "New York",
//         state: "NY",
//         name: "The John Dory Oyster Bar",
//         description: "A seafood-focused bar with a menu of fresh oysters, raw fish, and other seafood dishes.",
//         rating: 4.0,
//         images: [
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/The_Spotted_Pig.jpg/250px-The_Spotted_Pig.jpg",
//             "https://cdn.vox-cdn.com/thumbor/CEUBffgRqxPOtkZFiFayeQR2S1U=/0x0:512x384/1200x0/filters:focal(0x0:512x384):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/19630424/Attachment.jpg",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRERVsVyGu_rJa_APtq8rhWqrAC1AABi7V7Dw&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-yR6hnDSJKiwWCDA1B5WNjxFhQX2r_fMniQ&s"
//         ]
//     },
//     {
//         coordinates: {
//             latitude: 40.729558,
//             longitude: -73.985507,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//         },
//         idx: 10,
//         address: "11 E 31st St Rooftop",
//         name: "The NoMad Bar",
//         zipCode: "10016",
//         city: "New York",
//         state: "NY",
//         description: "A modern cocktail bar with a menu of unique and delicious drinks, located in the NoMad Hotel.",
//         rating: 3.9,
//         images: [
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6C90CIMJgb6P25VLZTA2x7oZm10J0E8Mlbw&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzqQV0sM2Oyix5i9bw6kGk5oPgRT2VhSc61Q&s",
//             "https://media-cdn.tripadvisor.com/media/photo-s/0b/43/14/0f/20160513-152127-largejpg.jpg",
//         ]
//     },
// ]

// async function main() {

//     await prisma.bars.createMany({
//         data: bars.map(bar => ({
//             id: bar.idx,
//             name: bar.name,
//             address: bar.address,
//             zipCode: bar.zipCode,
//             city: bar.city,
//             state: bar.state,
//             country: 'USA',
//             description: bar.description,
//             latitude: bar.coordinates.latitude,
//             longitude: bar.coordinates.longitude,
//             availability: 'OPEN',
//         })
//         )
//     })

//     // Then create the images with flattened array
//     const barImages = bars.flatMap(bar =>
//         bar.images.map(image => ({
//             url: image,
//             bar_id: bar.idx,
//         }))
//     )

//     await prisma.barsImages.createMany({
//         data: barImages
//     })

//     console.log('Database has been seeded!')
// }

// main()
//     .catch((e) => {
//         console.error(e)
//         process.exit(1)
//     })
//     .finally(async () => {
//         await prisma.$disconnect()
//     })
