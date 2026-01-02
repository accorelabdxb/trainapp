import React from "react";
import { Text, View } from "react-native";

interface ChallengeRulesProps {
    rules: string;
}

export const ChallengeRules = React.memo(({ rules }: ChallengeRulesProps) => {
    const parsedRules = React.useMemo(() => {
        if (!rules) return [];
        return rules
            .match(/"([^"]*)"/g)
            ?.map((rule) => rule.replace(/"/g, "")) || [];
    }, [rules]);

    if (!parsedRules.length) return null;

    return (
        <View className='px-4'>
            <Text className='text-white font-bold text-[22px] leading-6 capitalize pb-3'>
                The Rules
            </Text>

            <View>
                {parsedRules.map((rule, i) => (
                    <Text
                        key={i}
                        className='text-[#9f9f9f] font-medium text-base leading-[26px] mb-3'>
                        {i + 1}. {rule}
                    </Text>
                ))}
            </View>
        </View>
    );
});
