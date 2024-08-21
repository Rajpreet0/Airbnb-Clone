"use client";

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";

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

    const [step, setStep] = useState(STEPS.CATEGORY);

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

    // Set the HTML Content on the Modal
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

  return (
    <Modal
        isOpen={rentModal.isOpen}
        onClose={rentModal.onClose}
        onSubmit={onNext}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
        title="Airbnb your home!"
        body={bodyContent}
    />
  )
}

export default RentModal