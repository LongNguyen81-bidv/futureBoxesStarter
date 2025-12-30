/**
 * Mock for expo-image-picker
 */

export const MediaTypeOptions = {
  All: 'All',
  Videos: 'Videos',
  Images: 'Images',
};

export const requestMediaLibraryPermissionsAsync = jest.fn(() =>
  Promise.resolve({
    status: 'granted',
    expires: 'never',
    canAskAgain: true,
    granted: true,
  })
);

export const getMediaLibraryPermissionsAsync = jest.fn(() =>
  Promise.resolve({
    status: 'granted',
    expires: 'never',
    canAskAgain: true,
    granted: true,
  })
);

export const launchImageLibraryAsync = jest.fn(() =>
  Promise.resolve({
    canceled: false,
    assets: [
      {
        uri: 'file:///mock/image1.jpg',
        width: 1920,
        height: 1080,
        type: 'image',
      },
    ],
  })
);

export const launchCameraAsync = jest.fn(() =>
  Promise.resolve({
    canceled: false,
    assets: [
      {
        uri: 'file:///mock/camera-image.jpg',
        width: 1920,
        height: 1080,
        type: 'image',
      },
    ],
  })
);

// Helper to simulate canceled picker
export const __setCanceled = () => {
  (launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
    canceled: true,
  });
};

// Helper to simulate permission denied
export const __setPermissionDenied = () => {
  (requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValueOnce({
    status: 'denied',
    expires: 'never',
    canAskAgain: false,
    granted: false,
  });
};
