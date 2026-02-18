from abc import ABC, abstractmethod
import random

class LLMInterface(ABC):
    @abstractmethod
    def generate_response(self, culture_label, user_input):
        pass

class SimulatedLLM(LLMInterface):
    """
    A simulated LLM that mimics cultural responses using keyword matching.
    This serves as a fallback and demonstration of the logic without API costs.
    """
    def generate_response(self, culture, text):
        text = text.lower()
        
        # Simple Language Detection
        lang = 'en'
        if any(kw in text for kw in ['hola', 'gracias', 'adios', 'qué', 'que']):
            lang = 'es'
        elif any(kw in text for kw in ['bonjour', 'merci', 'au revoir', 'quoi']):
            lang = 'fr'
        elif any(kw in text for kw in ['hallo', 'danke', 'auf wiedersehen', 'was']):
            lang = 'de'
        # Detect Arabic Script
        elif any(char >= '\u0600' and char <= '\u06FF' for char in text):
            lang = 'ar'
        # Detect Arabizi / Transliterated
        elif any(kw in text for kw in ['salam', 'shukran', 'habibi', 'yalla', 'khalas', 'inshallah']):
            lang = 'ar_lat'

        # Keyword detection (English + mapped)
        is_price = any(kw in text for kw in ['price', 'cost', 'money', 'expensive', 'cheap', 'precio', 'coût', 'kosten', 'filus', 'sa3r', 'flous', 'prix'])
        # Arabic keyword checks (simple substring matching)
        if lang == 'ar':
            is_price = any(kw in text for kw in ['سعر', 'تكلفة', 'فلوس', 'غالي', 'رخيص'])
            
        is_bad = any(kw in text for kw in ['no', 'bad', 'wrong', 'hate', 'dislike', 'mal', 'mauvais', 'schlecht', 'mish', 'mo', 'laa'])
        if lang == 'ar':
            is_bad = any(kw in text for kw in ['لا', 'سيء', 'غلط', 'كره', 'مش'])

        is_hello = any(kw in text for kw in ['hi', 'hello', 'hey', 'greetings', 'hola', 'bonjour', 'hallo', 'salam', 'marhaba', 'ahlan'])

        # Response logic ported from frontend
        if 'Japanese' in culture:
            if is_price: return 'Regarding the investment required, we would be honored to discuss a structure that brings mutual prosperity.'
            if is_bad: return 'We deeply apologize if our approach did not meet your expectations. We will improve immediately.'
            
        elif 'NYC' in culture:
            if is_price: return 'The bottom line is about $50k. Good ROI though, trust me.'
            if is_bad: return 'Alright, what’s the issue? Let’s fix it and move on. Time is money.'
            
        elif 'Yoruba' in culture:
            if is_price: return 'A good soup requires money to cook. Value is not just in gold, but in lasting satisfaction.'
            if is_bad: return 'The river that forgets its source will dry up. Let us find the root of this disagreement together.'
            
        elif 'Aristocratic' in culture: # British
            if is_price: return 'One must consider the value proposition, which is, naturally, quite substantial.'
            if is_bad: return 'Oh dear. That is rather unfortunate. We shall endeavor to rectify this.'
            
        elif 'Bangalore' in culture: # Indian
            if is_price: return 'Current pricing is very competitive, sir/ma’am. Best value for money.'
            if is_bad: return 'Sorry for the inconvenience. Kindly tell me the issue, I will do the needful.'

        elif 'German' in culture:
            if is_price: return 'The cost is calculated precisely based on required resources. No hidden fees.'
            if is_bad: return 'Error acknowledged. Corrective measures are being initiated.'

        elif 'Brazilian' in culture:
            if is_price: return 'Don’t worry about the cost now, let’s see the value! It’s gonna be worth it!'
            if is_bad: return 'Relax, my friend! We can fix this, no stress.'
            
        elif 'French' in culture:
            if is_price: return 'Quality has a price. If you want mediocrity, look elsewhere.'
            if is_bad: return 'I disagree with your assessment, but I will listen to your reasoning.'
            
        elif 'Gen Z' in culture:
            if is_price: return 'It’s kinda pricey but honestly? Worth it.'
            if is_bad: return 'Oof. Big yikes. My bad bestie.'
            
        elif 'Saudi' in culture:
            if lang == 'ar':
                if is_price: return 'لَا تَشْغَلْ بَالَكَ بِالتَّكْلِفَةِ بَيْنَ الْأَصْدِقَاءِ. سَنَجِدُ حَلًّا مُنَاسِبًا بِإِذْنِ اللَّهِ.'
                if is_bad: return 'نَسْتَسْمِحُكَ عُذْرًا. رِضَاكُمْ هُوَ غَايَتُنَا وَوَاجِبُنَا.'
                return 'عَلَى رَأْسِي. سَيَتِمُّ تَنْفِيذُ طَلَبِكُمْ عَلَى الْفَوْرِ.'
            
            # English or Mixed (Arabizi flavor) as requested
            if is_price: return 'Do not worry about the cost (filus) between friends. We will find a fair arrangement, Inshallah.'
            if is_bad: return 'We seek your forgiveness (samahni). Your satisfaction is our duty.'
            
        if 'Australian' in culture:
            if is_price: return 'Bit steep, but you get what you pay for, aye?'
            if is_bad: return 'Yeah, nah, that’s no good. We’ll sort it out mate.'

        # Search / Information Retrieval Intent
        if any(kw in text for kw in ['search', 'find', 'lookup', 'google', 'buscar', 'chercher', 'suchen', 'bahth']):
            search_query = text.replace('search', '').replace('find', '').replace('lookup', '').strip()
            
            if lang == 'es': return f"Buscando en la base de datos cultural sobre '{search_query}'... [Simulación: 3 resultados encontrados]"
            if lang == 'fr': return f"Recherche dans la base de données culturelle pour '{search_query}'... [Simulation: 3 résultats trouvés]"
            if lang == 'de': return f"Suche in der Kulturdatenbank nach '{search_query}'... [Simulation: 3 Ergebnisse gefunden]"
            if lang == 'ar': return f"جارٍ البحث في قاعدة البيانات الثقافية عن '{search_query}'... [محاكاة: تم العثور على 3 نتائج]"
            
            return f"Searching cultural knowledge base for '{search_query}'... \n\n[Displaying top 3 cultural insights...]"
            
        # Universal / Fallback
        if is_price: 
            if lang == 'es': return 'El modelo de precios estándar se aplica según los niveles de uso.'
            if lang == 'fr': return 'Le modèle de tarification standard s\'applique en fonction des niveaux d\'utilisation.'
            if lang == 'de': return 'Das Standardpreismodell gilt je nach Nutzungsstufe.'
            if lang == 'ar': return 'يتم تطبيق نموذج التسعير القياسي بناءً على مستويات الاستخدام.'
            return 'The standard pricing model applies based on usage tiers.'
        
        if is_bad: 
            if lang == 'es': return 'Agradezco sus comentarios. Por favor especifique el problema.'
            if lang == 'fr': return 'Je prends note de vos commentaires. Veuillez préciser le problème.'
            if lang == 'de': return 'Ich nehme Ihr Feedback zur Kenntnis. Bitte geben Sie das Problem an.'
            if lang == 'ar': return 'نحن نقدر ملاحظاتكم. يرجى توضيح المشكلة.'
            return 'I acknowledge your feedback. Please specify the issue.'
            
        # ... (keep existing intent checks)

        # Dynamic Q&A Simulation
        return self._simulate_qa_response(culture, text, lang)

    def _simulate_qa_response(self, culture, text, lang):
        """
        Generates a simulated Q&A response based on the culture and language.
        This replaces the static single-line returns.
        """
        # Base templates for "I don't know" or "Here is what I think"
        # In a real app, this would be the LLM generation step.
        
        prefix = ""
        suffix = ""
        
        if 'Japanese' in culture:
            prefix = "Reflecting on your query: "
            suffix = " I hope this perspective is helpful."
        elif 'NYC' in culture:
            prefix = "Here's the deal: "
            suffix = " Simple as that."
        elif 'Yoruba' in culture:
            prefix = "The elders say: "
            suffix = " Wisdom is a journey."
        elif 'Aristocratic' in culture:
            prefix = "One might opine that "
            suffix = " Indeed."
        elif 'Bangalore' in culture:
            prefix = "Basically, "
            suffix = " Please revert if you have doubts."
        elif 'German' in culture:
            prefix = "Analysis: "
            suffix = " Logic dictates this."
        elif 'Brazilian' in culture:
            prefix = "Look, "
            suffix = " access it!"
        elif 'French' in culture:
            prefix = "From a certain point of view, "
            suffix = " But c'est la vie."
        elif 'Gen Z' in culture:
            prefix = "So basically, "
            suffix = " no cap."
        elif 'Saudi' in culture:
            if lang == 'ar':
                return f"بناءً على طلبك: {text} - هذا أمر يستحق النظر."
            prefix = "In our view, "
            suffix = " Inshallah it is clear."
        elif 'Australian' in culture:
            prefix = "Reckon that "
            suffix = " hope that helps mate."
        else: # Universal
            if lang == 'es': return f"Respuesta simulada para: {text}"
            if lang == 'fr': return f"Réponse simulée pour: {text}"
            if lang == 'de': return f"Simulierte Antwort für: {text}"
            if lang == 'ar': return f"رد محاكي لـ: {text}"
            prefix = "Response: "
            suffix = "."

        # Return a mirrored response to simulate "thinking"
        return f"{prefix} regarding '{text}' - valid point. {suffix}"

# Factory or Dependency Injection pattern
def get_llm_service():
    # In a real app, check os.environ.get("OPENAI_API_KEY")
    return SimulatedLLM()
