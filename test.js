const test = {
    isProductReview: false,
    useGoogleMap: false,
    enableTerms: true,
    enableCoupons: true,
    enableReviewPopup: true,
    reviewSystem: {
        name: 'Chỉ đánh giá sản phẩm đã mua một lần. (Theo mặc định)',
        value: 'review_single_time',
    },
    deliveryTime: {},
    maxShopDistance: null,
    seo: {
        metaTitle: null,
        metaDescription: null,
        metaTags: null,
        canonicalUrl: null,
        ogTitle: null,
        ogDescription: null,
        twitterHandle: null,
        twitterCardType: null,
        ogImage: null,
    },
    logo: {
        thumbnail: 'https://shop-dev.zoffice.vn/backend/storage/4313/conversions/Shop-4-thumbnail.jpg',
        original: 'https://shop-dev.zoffice.vn/backend/storage/4313/Shop-4.png',
        id: 4316,
        file_name: 'Shop-4.png',
    },
    collapseLogo: {
        thumbnail: 'https://shop-dev.zoffice.vn/backend/storage/4314/conversions/Shop-3-thumbnail.jpg',
        original: 'https://shop-dev.zoffice.vn/backend/storage/4314/Shop-3.png',
        id: 4317,
        file_name: 'Shop-3.png',
    },
    useOtp: false,
    currency: 'VND',
    siteTitle: 'Zoffice',
    freeShipping: false,
    signupPoints: 0,
    siteSubtitle: 'Your next ecommerce',
    shippingClass: 4,
    contactDetails: {
        location: {
            country: 'Việt Nam',
            city: 'Bắc Giang',
            state: 'Huyện Lạng Giang',
            ward: 'Xã Tiên Lục',
            street_address: null,
            formattedAddress: 'Xã Tiên Lục, Huyện Lạng Giang, Bắc Giang, Việt Nam',
        },
        website: 'https://redq.io',
        emailAddress: 'nguyenvanb@gmail.com',
        contact: '840321456789',
        socials: {
            0: {
                icon: 'FacebookIcon',
                url: 'https://www.facebook.com/kembaccuc138nguyenanninh?locale\u003dvi_VN',
            },
        },
    },
    paymentGateway: {
        0: {
            name: 'stripe',
            title: 'Stripe',
        },
        1: {
            name: 'paypal',
            title: 'Paypal',
        },
    },
    currencyOptions: {
        fractions: 3,
        formation: 'vi-VN',
    },
    useEnableGateway: false,
    useCashOnDelivery: true,
    freeShippingAmount: null,
    minimumOrderAmount: 3,
    useMustVerifyEmail: false,
    maximumQuestionLimit: 2,
    currencyToWalletRatio: 10,
    enableEmailForDigitalProduct: false,
    StripeCardOnly: false,
    guestCheckout: true,
    server_info: {
        upload_max_filesize: 2048,
        memory_limit: '128M',
        max_execution_time: '30',
        max_input_time: '60',
        post_max_size: 8192,
    },
    useAi: false,
    siteLink: 'https://pickbazar.redq.io',
    copyrightText: 'Copyright © REDQ. All rights reserved worldwide.',
    externalText: 'REDQ',
    externalLink: 'https://redq.io',
    smsEvent: {
        admin: {
            statusChangeOrder: true,
            refundOrder: true,
            paymentOrder: true,
        },
        vendor: {
            statusChangeOrder: true,
            paymentOrder: true,
            refundOrder: true,
        },
        customer: {
            statusChangeOrder: true,
            refundOrder: true,
            paymentOrder: true,
        },
        all: {},
    },
    emailEvent: {
        admin: {
            statusChangeOrder: true,
            refundOrder: true,
            paymentOrder: true,
        },
        vendor: {
            statusChangeOrder: true,
            refundOrder: true,
            paymentOrder: true,
            createQuestion: true,
            createReview: true,
        },
        customer: {
            statusChangeOrder: true,
            refundOrder: true,
            paymentOrder: true,
            answerQuestion: true,
        },
        all: {},
    },
    pushNotification: {
        admin: {},
        vendor: {},
        customer: {},
        all: {
            storeNotice: true,
            order: true,
            message: true,
        },
    },
    isUnderMaintenance: false,
    maintenance: {
        title: 'Site is under Maintenance',
        description:
            'We are currently undergoing essential maintenance to elevate your browsing experience. Our team is working diligently to implement improvements that will bring you an even more seamless and enjoyable interaction with our site. During this period, you may experience temporary inconveniences. We appreciate your patience and understanding. Thank you for being a part of our community, and we look forward to unveiling the enhanced features and content soon.',
        buttonTitleOne: 'Notify Me',
        buttonTitleTwo: 'Contact Us',
        newsLetterTitle: 'Subscribe Newsletter',
        newsLetterDescription:
            'Stay in the loop! Subscribe to our newsletter for exclusive deals and the latest trends delivered straight to your inbox. Elevate your shopping experience with insider access.',
        aboutUsTitle: 'About Us',
        aboutUsDescription:
            'Welcome to Pickbazar, your go-to destination for curated excellence. Discover a fusion of style, quality, and affordability in every click. Join our community and elevate your shopping experience with us!',
        contactUsTitle: 'Contact Us',
        image: {
            id: 1794,
            file_name: 'background.png',
            original: 'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1792/background.png',
            thumbnail:
                'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1792/conversions/background-thumbnail.jpg',
        },
        start: '2024-08-06T17:00:00.000Z',
        until: '2024-08-08T17:00:00.000Z',
        isOverlayColor: false,
    },
    isPromoPopUp: false,
    promoPopup: {
        title: 'Get 25% Discount',
        description:
            'Subscribe to the mailing list to receive updates on new arrivals, special offers and our promotions.',
        popUpDelay: 5000,
        popUpExpiredIn: 1,
        popUpNotShow: {
            title: 'Don\u0027t show this popup again',
            popUpExpiredIn: 7,
        },
        image: {
            id: 1793,
            original: 'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1791/pickbazar02.png',
            file_name: 'pickbazar02.png',
            thumbnail:
                'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1791/conversions/pickbazar02-thumbnail.jpg',
        },
        isPopUpNotShow: true,
    },
    app_settings: {
        last_checking_time: '2024-08-20T09:00:55.757930Z',
        trust: true,
    },
    taxClass: 13,
}

console.log(JSON.stringify(test))
