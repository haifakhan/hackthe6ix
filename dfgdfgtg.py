# Creating RAG chain for medical info
urls = [
    "https://www.example.com",  # Replace with actual URLs
    "https://www.anotherexample.com"
]

def scrape_web_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser') # removing nav, footer, etc.
    # Extract text content from the page
    content = soup.get_text(separator='\n')
    return content

documents = [scrape_web_content(url) for url in urls]

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)

docs = []
for doc in documents:
    chunks = text_splitter.split_text(doc)
    docs.extend(chunks)

doc_objs = [Document(page_content=chunk) for chunk in docs]
embeddings = GoogleGenerativeAIEmbeddings(model="gemini-1.5-pro", google_api_key=gemini_key)

rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True
)

def medical_info(query):
    """
    Searches trusted medical websites for information related to the query.
    """
    result = rag_chain({{"query": query}})
    return result['result']