export default function useFaq() {
    const { getFaqs } = useApi();
    const sections = ref([]);

    const fetchFaqs = async() => {
        const { data } = await getFaqs();
        if(data.value) {
            sections.value = data.value;
        }
    };

    return {
        sections,
        fetchFaqs,
    };
}
