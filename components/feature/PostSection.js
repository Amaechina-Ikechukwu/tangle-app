import ImagePicker from 'react-native-image-picker'; // Import at the top
import React, { useState} from 'react';
import { Image, View, StyleSheet, TouchableOpacity, Icon, Text} from 'react-native';
import image from '../../assets/images/onboarding/face_3.jpg'

const PostSection = ({ onPostPress }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const pickImage = () => {
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setSelectedImage(response.uri);
            }
        });
    };

    return (
        <View style={styles.postSection}>
            <Image 
                source={image } 
                style={styles.profilePic} 
            />
            <TouchableOpacity style={styles.postInput} onPress={onPostPress}>
                <Text style={styles.postInputText}>What's on your mind?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage}>
                <Icon name="image" size={24} color="gray" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create ({
    postSection: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    postInput: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingLeft: 10,
        justifyContent: 'center',
    },
    postInputText: {
        fontSize: 16,
        color: '#888',
    }
})

export default PostSection;
