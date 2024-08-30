"use client";

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Steps inside the Modal for Listing
enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const rentModal = useRentModal();
    const router = useRouter();

    const [step, setStep] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: ''
        },
    });

    const category = watch('category');
    const location = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc')

    // Dynamically load the Custom Map, bc it is not supported by Next
    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location]);


    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        })
    }

    // Controllings in the Modal

    const onBack = () => {
        setStep((value) => value - 1);
    };

    const onNext = () => {
        setStep((value) => value + 1);
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if(step !== STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);

        axios.post('/api/listings', data)
        .then(() => {
            toast.success('Listing Created!');
            router.refresh();
            reset();
            setStep(STEPS.CATEGORY);
            rentModal.onClose();
        }).catch(() => {
            toast.error('Something went wrong.');
        }).finally(() => {
            setIsLoading(false);
        })
    }    


    // Set the Button Text based on the Step
    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Create';
        }

        return 'Next';
    }, [step]);

    // Set the secondary Button Text based on the Step
    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined
        }

        return 'Back';
    }, [step])

    // Set the HTML Content on the Modal for the Categories
    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading 
                title="Which of these best describes your place?"
                subtitle="Pick a category"
            />
            <div className="grid gird-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                {/* Load the categories Object Array from NavBar */}
                {categories.map((item) => (
                    <div key={item.label} className="col-span-1">
                        <CategoryInput
                            onClick={(category) => setCustomValue('category', category)}
                            selected={category === item.label}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>    
    )

    // Set the HTML Content for the Location Step on the Modal whith Dropdown Menu and the Map
    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Where is your place located ?"
                    subtitle="Help guests find you!"/>
                <CountrySelect
                    value={location}
                    onChange={(value) => setCustomValue('location', value)}
                />
                <Map
                    center={location?.latlng}
                />
            </div>
        )
    }

    // Set the HTML Content for the Counter Step on the Modal
    if(step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Share some basics about your place"
                    subtitle="What amenities do you have ?"
                />
                <Counter
                    title="Guests"
                    subtitle="How many guests do you allow ?"
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value)}/>
                <hr/>
                <Counter
                    title="Rooms"
                    subtitle="How many rooms do you have ?"
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value)}/>
                <hr/>
                <Counter
                    title="Bathrooms"
                    subtitle="How many bathrooms do you have ?"
                    value={bathroomCount}
                    onChange={(value) => setCustomValue('bathroomCount', value)}/>
            </div>
        )
    }

    // Set the HTML Content for the Image Upload Step on the Modal
    if(step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Add a photo of your place"
                    subtitle="Show guests what your place looks like!"/>
                <ImageUpload
                    value={imageSrc}
                    onChange={(value) => setCustomValue('imageSrc', value)}
                    />
            </div>
        )
    }

    // Set the HTML Content for the Description Step on the Modal
    if(step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="How would you describe your place ?"
                    subtitle="Short and sweet works best!"/>
                <Input
                    id="title"
                    label="Title"
                    disabled={isLoading}
                    register={register}
                    erros={errors}
                    required
                />
                <hr/>
                <Input
                    id="description"
                    label="Description"
                    disabled={isLoading}
                    register={register}
                    erros={errors}
                    required
                />
            </div>
        )
    }

    // Set the HTML Content for the Price Step on the Modal
    if(step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Now, set your price"
                    subtitle="How much do you charge per night?"/>
                <Input
                    id="price"
                    label="Price"
                    formatPrice
                    type="number"
                    disabled={isLoading}
                    register={register}
                    erros={errors}
                    required/>
            </div>
        )
    }

  return (
    <Modal
        isOpen={rentModal.isOpen}
        onClose={rentModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
        title="Airbnb your home!"
        body={bodyContent}
    />
  )
}

export default RentModal